import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';

import {IEntity} from '../classes/IEntity';
import {IEntityDef} from '../classes/IEntityDef';
import { DataService }    from '../data.service';

import { MatDialog } from '@angular/material';

@Component({
  selector: 'entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['../css/list-common.css']
})
export class EntityListComponent implements OnInit {
  selectAll:boolean=false;
  title:string="Entity List";
  @Input()entities:{options:any,entity:IEntity}[]=[];
  @Output()onSelect:EventEmitter<string> = new EventEmitter<string>();
  @Output()onDelete:EventEmitter<string> = new EventEmitter<string>();
  @Output()onChecked:EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private ds: DataService,public dialog: MatDialog,
          public zone: NgZone) { }

  ngOnInit() {
//      console.log(`EntityList ${JSON.stringify(this.entities)}`);
  }

  selected(uuid:string){
       this.onSelect.emit(uuid);
  }
  delete(uuid:string){
      this.onDelete.emit(uuid);
  }
  onSelectAll(){
      this.entities.forEach(e=>{
          e.options.check=!this.selectAll;
      });
  }
  checked(uuid:string){
      this.onChecked.emit(uuid);
      this.selectAll=false;
  }
}
