
import { DataModel,Node, Link } from '../classes/data.model';

let _data:DataModel;
let _nodeMap:any; 
let _links:any[];

function nodesToMap(nodes:Node[]):any{
    const map={};
    nodes.forEach((n,i)=>{
        map[n.uuid]=n;
    });
    return map;
}
function setData(data:DataModel){
    _data=data;
    _links=setLinks(data.links);
    _nodeMap=nodesToMap(_data.nodes);
}
function nodeByUuid(uuid:string):Node{
    return this.nodeMap[uuid];
}
function setLinks(links:Link[]):any[]{
    _data.links.forEach(l=>{
        _links.push({ 
            source: this.getNodeByUuid(l.source), 
            target: this.getNodeByUuid(l.target), 
            left: l.left, right: l.right,
            label:l.label, 
            uuid:l.uuid,
            linkNum:1
        });
    });
    //sort links by source, then target
    _links=_links.sort(function(a,b) {
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
            _links[i].source.uuid == _links[i-1].source.uuid &&
            _links[i].target.uuid == _links[i-1].target.uuid) {
            _links[i].linknum = _links[i-1].linknum + 1;
            console.log(`link ${JSON.stringify(_links[i])}`);
        }else {
            _links[i].linknum = 1;
        }
    }
    return _links
}
export  const canvasData={
        setData:setData,
        nodeMap:_nodeMap,
        nodeByUuid:nodeByUuid,
        nodes:_data.nodes,
        links:_links,
        data:_data
}
