import { Component, ViewChild, ElementRef, Input, Output, OnInit,EventEmitter,HostListener } from '@angular/core';
import * as d3 from 'd3';
import { DataModel,Node, Link } from '../classes/data.model';

import { MatDialog } from '@angular/material';
import { ModalDialog, DialogOptions } from '../modal-dialog/modal-dialog';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.css']
  })
  export class CanvasComponent implements OnInit {
    @ViewChild('canvas', {read: ElementRef,static:true})   
    private canvas: ElementRef;

    @Input()data: DataModel;
    @Input()dialogOpen: boolean=false;
    @Output()onSelectEntity:EventEmitter<string> = new EventEmitter<string>();
    @Output()onSelectRelationship:EventEmitter<{}> = new EventEmitter<{}>();

    width = 960;
    height = 600;
    colors = d3.scaleOrdinal(d3.schemeCategory10);
    NODE_RADIUS=12;
    ENTITY_COLOURS={Person:"red",Organisation:"blue",Event:"green"};
    

    svg: any;
    force: any;
    path: any;
    circle: any;
    drag: any;
    dragLine: any;

    // mouse event vars
    selectedNode = null;
    selectedLink = null;
    mousedownLink = null;
    mousedownNode = null;
    mouseupNode = null;
    
    
    lastNodeId = 2;
    // only respond once per keydown
    lastKeyDown = -1;

    nodes=[];
    nodeMap={};
    links=[];

    showTick=true;
    
    constructor(public dialog: MatDialog){
    }
    ngOnInit(){
    }
    ngAfterContentInit() {
      this.nodeMap = this.nodesToMap(this.data.nodes);
      this.nodes=this.data.nodes;
      this.data.links.forEach(l=>{
          this.links.push({ source: this.getNodeByUuid(l.source), 
                            target: this.getNodeByUuid(l.target), 
                            left: l.left, right: l.right,
                            label:l.label, 
                            uuid:l.uuid,
                            linkNum:1})
      });
    //sort links by source, then target
      this.links=this.links.sort(function(a,b) {
          if (a.source.uuid > b.source.uuid) {return 1;}
          else if (a.source.uuid < b.source.uuid) {return -1;}
          else {
              if (a.target.uuid > b.target.uuid) {return 1;}
              if (a.target.uuid < b.target.uuid) {return -1;}
              else {return 0;}
          }
      });
      //any links with duplicate source and target get an incremented 'linknum'
      for (var i=0; i<this.links.length; i++) {
          if (i != 0 &&
              this.links[i].source.uuid == this.links[i-1].source.uuid &&
              this.links[i].target.uuid == this.links[i-1].target.uuid) {
              this.links[i].linknum = this.links[i-1].linknum + 1;
              console.log(`link ${JSON.stringify(this.links[i])}`);
          }else {
              this.links[i].linknum = 1;
          }
      }
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      
      d3.select('svg').remove();
      const element = this.canvas.nativeElement;
      
      this.width = rect.width;

      this.svg = d3.select(element).append('svg')
        .attr('oncontextmenu', 'return false;')
        .attr('width', this.width)
        .attr('height', this.height);

      this.force = d3.forceSimulation()
        .force('link', d3.forceLink().id((d: any) => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('x', d3.forceX(this.width / 2))
        .force('y', d3.forceY(this.height / 2))
        .on('tick', () => this.tick());
        
//      this.force.drag()
//        .on("dragstart",this.dragstart);
      
      // init D3 drag support
      this.drag = d3.drag()
        .on('start', (d: any) => {
          if (!d3.event.active) this.force.alphaTarget(0.3).restart();

          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (d: any) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on('end', (d: any) => {
          if (!d3.event.active) this.force.alphaTarget(0.3);

          d.fx = null;
          d.fy = null;
        });


      // define arrow markers for graph links
      this.svg.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#000');

      this.svg.append('svg:defs').append('svg:marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', '#000');


      // line displayed when dragging new nodes
      this.dragLine = this.svg.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

      // handles to link and node element groups
      this.path = this.svg.append('svg:g').selectAll('path');
      this.circle = this.svg.append('svg:g').selectAll('g');

      // app starts here
      this.svg.on('mousedown', (dataItem, value, source) => this.addNode(dataItem, value, source))
        .on('mousemove', (dataItem) => this.mousemove(dataItem))
        .on('mouseup', (dataItem) => this.mouseup(dataItem));
      d3.select(window)
        .on('keydown', ()=>{ this.keydown();})
        .on('keyup', ()=>{ this.keyup();} );
      this.restart();
    }

    setEntityColour(d){
        let colour;
        if(this.ENTITY_COLOURS[d.type]){
           colour=this.ENTITY_COLOURS[d.type];
        }else{
            colour="grey";
        }
        return colour;
    }
    
    // update force layout (called automatically each iteration)
    tick() {
      // draw directed edges with proper padding from node centers
      this.path.attr('d', (d: any) => {
          
         /**      X
          *  __________
          *  |        /
          *  |       /
          *  |      /
          * Y|     /Z
          *  |    /
          *  |   /
          *  |  /
          *  | /
          *  |/
          */
        const lenX = d.target.x - d.source.x;                     //calculate the difference between the target and source X positions
        const lenY = d.target.y - d.source.y;                     //calculate the difference between the target and source Y positions
        const lenZ = Math.sqrt(lenX * lenX + lenY * lenY);        //calculate the length of Z (Z=sqrt(X^2 + Y^2)
        const normX = lenX / lenZ;                                 
        const normY = lenY / lenZ;
        const sourceX = d.source.x + (this.NODE_RADIUS * normX);     //calculate start(source) & end(target) of path
        const sourceY = d.source.y + (this.NODE_RADIUS * normY);
        const targetX = d.target.x - (this.NODE_RADIUS * normX);
        const targetY = d.target.y - (this.NODE_RADIUS * normY);
        const dr = 400/(d.linknum - (d.linknum%2));  // dr determines distance from centre path. We only want to change dr every second line so we get pairs.


        let pattern="";
        if(d.linknum>1){
            const sweep = (d.linknum-1)%2; //determines which side the path arcs. 0=>left, 1=>right
            pattern= `M ${sourceX},${sourceY} A ${dr} ${dr} 0 0 ${sweep} ${targetX} ${targetY}`;
        }else{
            pattern= `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
        }
        return pattern;
      });
      
      this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }
    
    resetMouseVars() {
      this.mousedownNode = null;
      this.mouseupNode = null;
      this.mousedownLink = null;
    }

    // update graph (called when needed)
    restart() {
      // path (link) group
      this.path = this.path.data(this.links);

      // update existing links
      this.path.classed('selected', (d) => { 
          let isSelectedLink= (this.selectedLink?d.uuid === this.selectedLink.uuid:false);
          return isSelectedLink;
        })
        .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
        .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '');

      // remove old links
      this.path.exit().remove();

      // add new links
      this.path = this.path.enter().append('svg:path')
        .attr('class', 'link')
        .classed('selected', (d) => this.selectedLink?d.uuid === this.selectedLink.uuid:false)
        .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
        .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
        .on('dblclick', (d)=>{
            this.dialogOpen=true;
            if(d.left){
                this.onSelectRelationship.emit({uuid:d.uuid,sourceUuid:d.target.uuid,targetUuid:d.source.uuid,label:d.label});
            }else{
                this.onSelectRelationship.emit({uuid:d.uuid,sourceUuid:d.source.uuid,targetUuid:d.target.uuid,label:d.label});
            }
            this.resetMouseVars();
            this.restart();
        })
        .on('mousedown', (d) => {
          if (d3.event.ctrlKey) return;
              
          // select link
          this.mousedownLink = d;
          this.selectedLink = (this.mousedownLink === this.selectedLink) ? null : this.mousedownLink;
          this.selectedNode = null;

          this.restart();
        })
        .merge(this.path);

      // circle (node) group
      // NB: the function arg is crucial here! nodes are known by id, not by index!
      this.circle = this.circle.data(this.nodes, (d) => d.uuid);//d.id);

      // update existing nodes (reflexive & selected visual states)
      this.circle.selectAll('circle')
        .style('fill', (d) => this.setEntityColour(d))//(d === this.selectedNode) ? d3.rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
        .style('stroke', (d) => d === this.selectedNode ? 'lime' : "black")//d3.rgb(this.colors(d.id)).darker().toString())
        .classed('reflexive', (d) => d.reflexive);

      // remove old nodes
      this.circle.exit().remove();

      // add new nodes
      const g = this.circle.enter().append('svg:g');

      g.append('svg:circle')
        .attr('class', 'node')
        .attr('r', this.NODE_RADIUS)
        .style('fill', (d) => this.setEntityColour(d))//(d === this.selectedNode) ? d3.rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
        .style('stroke', (d) => "black")//d3.rgb(this.colors(d.id)).darker().toString())
        .classed('reflexive', (d) => d.reflexive)
        .on('dblclick',(d)=>{
            this.resetMouseVars();
            this.onSelectEntity.emit(d.uuid);
        })
        .on('mouseover', function (d) {
          // enlarge target node
          d3.select(this).attr('transform', 'scale(2)');
        })
        .on('mouseout', function (d) {
          // unenlarge target node
          d3.select(this).attr('transform', '');
        })
        .on('mousedown', (d) => {
          if (d3.event.ctrlKey) return;
          // select node
          this.mousedownNode = d;
          this.selectedNode = (this.mousedownNode === this.selectedNode) ? null : this.mousedownNode;
          this.selectedLink = null;
          this.dialogOpen=false;
//          d3.select(d3.event.currentTarget).attr('stroke', 'lime');
          // reposition drag line
          this.dragLine
            .style('marker-end', 'url(#end-arrow)')
            .classed('hidden', false)
            .attr('d', `M${this.mousedownNode.x},${this.mousedownNode.y}L${this.mousedownNode.x},${this.mousedownNode.y}`);

          this.restart();
//          console.log(`mousedown: ${this.selectedNode}`);
        })
        .on('mouseup', (dataItem: any) => {
//          debugger;
          if (!this.mousedownNode) return;

          // needed by FF
          this.dragLine
            .classed('hidden', true)
            .style('marker-end', '');

          // check for drag-to-self
          this.mouseupNode = dataItem;
          if (this.mouseupNode === this.mousedownNode) {
            this.resetMouseVars();
            return;
          }
          
          // unenlarge target node
          d3.select(d3.event.currentTarget)
              .attr('transform', '');

          // add link to graph (update if exists)
          // NB: links are strictly source < target; arrows separately specified by booleans
          const isRight = this.mousedownNode.id < this.mouseupNode.id;
          const source = isRight ? this.mousedownNode : this.mouseupNode;
          const target = isRight ? this.mouseupNode : this.mousedownNode;

          const link = this.links.filter((l) => l.source === source && l.target === target)[0];
          if (link) {
            link[isRight ? 'right' : 'left'] = true;
          } else {
            this.links.push({ source, target, left: !isRight, right: isRight,label:"" });
          }

          // select new link
          this.selectedLink = link;
          this.selectedNode = null;
          this.restart();
        });

      // Append images
      g.append("svg:image")
        .attr("pointer-events","none")
        .attr("xlink:href",  (d) =>{ return '/assets/'+d.type+'.svg';})
        .attr("x", (d) =>{ return -9;})
        .attr("y", (d) =>{ return -9;})
        .attr("height", (this.NODE_RADIUS*2)-6)
        .attr("width", (this.NODE_RADIUS*2)-6);
      
      // show node Labels
      g.append('svg:text')
        .attr('x', 0)
        .attr('y', 24)
        .attr('class', 'id')
        .text((d) => d.label);

      this.circle = g.merge(this.circle);

      // set the graph in motion
      this.force
        .nodes(this.nodes)
        .force('link').links(this.links);

      this.force.alphaTarget(0.3).restart();
    }

    addNode(dataItem: any, value: any, source: any) {
      // because :active only works in WebKit?
      this.svg.classed('active', true);

      if (!d3.event.ctrlKey || this.mousedownNode || this.mousedownLink) return;

      // insert new node at point
      const point = d3.mouse(d3.event.currentTarget);
      // const point = d3.mouse(this);
      const node = { id: ++this.lastNodeId, reflexive: false, x: point[0], y: point[1] };
      this.nodes.push(node);

      this.restart();
    }

    mousemove(source: any) {
      if (!this.mousedownNode) return;

      // update drag line
      this.dragLine.attr('d', `M${this.mousedownNode.x},${this.mousedownNode.y}L${d3.mouse(d3.event.currentTarget)[0]},${d3.mouse(d3.event.currentTarget)[1]}`);

      this.restart();
    }

    mouseup(source: any) {
      if (this.mousedownNode) {
        // hide drag line
        this.dragLine
          .classed('hidden', true)
          .style('marker-end', '');
      }

      // because :active only works in WebKit?
      this.svg.classed('active', false);

      // clear mouse event vars
      this.resetMouseVars();
    }

    spliceLinksForNode(node) {
      const toSplice = this.links.filter((l) => l.source === node || l.target === node);
      for (const l of toSplice) {
        this.links.splice(this.links.indexOf(l), 1);
      }
    }

    async keydown() {
      let result:DialogOptions;
      if (this.lastKeyDown !== -1) return;
      this.lastKeyDown = d3.event.keyCode;

      // ctrl
      if (d3.event.keyCode === 17) {
        this.circle.call(this.drag);
        this.svg.classed('ctrl', true);
      }

      console.log(`dialogOpen:${this.dialogOpen}`);
      if(!this.dialogOpen){
      switch (d3.event.keyCode) {
          case 8: // backspace
          case 46: // delete
            console.log(`backspace/delete`);
            result = await this.openDialog("Are you sure you want to delete this Entity/Link.",
                    DialogOptions.QUESTION+DialogOptions.OK+DialogOptions.CANCEL);
            if(result == DialogOptions.OK){
                if (this.selectedNode) {
                  this.nodes.splice(this.nodes.indexOf(this.selectedNode), 1);
                  this.spliceLinksForNode(this.selectedNode);
                } else if (this.selectedLink) {
                  this.links.splice(this.links.indexOf(this.selectedLink), 1);
                }
                this.selectedLink = null;
                this.selectedNode = null;
                this.restart();
            } 
            break;
//          case 66: // B
//            console.log(`B`);
//            if (this.selectedLink) {
//              // set link direction to both left and right
//              this.selectedLink.left = true;
//              this.selectedLink.right = true;
//            }
//            this.restart();
//            break;
          case 76: // L
              console.log(`L`);
            if (this.selectedLink) {
              // set link direction to left only
              this.selectedLink.left = true;
              this.selectedLink.right = false;
            }
            this.restart();
            break;
          case 82: // R
             console.log(`R`);
            if (this.selectedNode) {
              // toggle node reflexivity
              this.selectedNode.reflexive = !this.selectedNode.reflexive;
            } else if (this.selectedLink) {
              // set link direction to right only
              this.selectedLink.left = false;
              this.selectedLink.right = true;
            }
            this.restart();
            break;
        }           
      }
  }

    keyup() {
      this.lastKeyDown = -1;

      // ctrl
      if (d3.event.keyCode === 17) {
        this.circle.on('.drag', null);
        this.svg.classed('ctrl', false);
      }
    }
    
    nodesToMap(nodes:Node[]):any{
        const map={};
        nodes.forEach((n,i)=>{
            map[n.uuid]=n;
        });
        return map;
    }
    getNodeByUuid(uuid:string):Node{
        return this.nodeMap[uuid];
    }

    dragstart(d){
        d3.select(d).classed("fixed", d.fixed = true);        
    }
 
    openDialog(message:string,options:number): Promise<number> {
        return new Promise(async (resolve,reject)=>{
            const dialogRef = this.dialog.open(ModalDialog, {
                width: '300px',
                backdropClass:'custom-dialog-backdrop-class',
                panelClass:'custom-dialog-panel-class',
                data: {message: message,
                       dialogOptions:options+DialogOptions.MANDATORY
                      }
              });
             let result= await dialogRef.afterClosed().toPromise();
             resolve(result.data);
        });
        
      }
  }
