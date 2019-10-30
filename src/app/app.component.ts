import { Component, NgZone, OnInit } from '@angular/core';

import { FieldService } from './field.service';
import { DataService } from './data.service';
import {IEntityDef} from './classes/IEntityDef';
import {IEntity} from './classes/IEntity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    fields: any[];
    isEntityFormVisible:boolean=false;
    isEntityDefFormVisible:boolean=false;
    euuid:string="";
    entityType:string="Person";
    entityDefType:string="Person";
    entities:IEntity[]=[];
    entityDefs:IEntityDef[];
    
    constructor(private  ds:DataService){}
    
    ngOnInit(){
        this.getEntities();
    }
    async getEntities() {
        this.entities = await this.ds.getEntityList();
    }
}
