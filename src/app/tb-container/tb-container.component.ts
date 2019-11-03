import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tb-container',
  templateUrl: './tb-container.component.html',
  styleUrls: ['./tb-container.component.css']
})
export class TbContainerComponent implements OnInit {
  @Input()align:string="left";
  
  mouseDown:boolean=false;
  constructor() { }

  ngOnInit() {
  }
  onMouseDown(){
      this.mouseDown=true;
      
  }
  onMouseUp(){
      this.mouseDown=false;
  }
  onMouseMove(e){
      if(this.mouseDown){
          console.log(`mouseX:${e.movementX}`);
      }
      
  }
}
