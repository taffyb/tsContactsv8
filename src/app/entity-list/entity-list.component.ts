import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  title:string="Entity List";
  @Input()entities:IEntity[]=[];
  @Output()onSelect:EventEmitter<string> = new EventEmitter<string>();
  @Output()onDelete:EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private ds: DataService,public dialog: MatDialog) { }

  ngOnInit() {
      console.log(`entities ${JSON.stringify(this.entities)}`);
  }

  selected(uuid:string){
       this.onSelect.emit(uuid);
  }
  delete(uuid:string){
      this.onDelete.emit(uuid);
  }
}
