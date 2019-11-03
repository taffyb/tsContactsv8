import { Component, NgZone, OnInit } from '@angular/core';

import { FieldService } from './field.service';
import { DataService } from './data.service';
import {IEntityDef} from './classes/IEntityDef';
import {IEntity} from './classes/IEntity';
import {BaseEntity} from './classes/BaseEntity';

import { MatDialog } from '@angular/material';
import { ModalDialog, DialogOptions } from './modal-dialog/modal-dialog';
import { EntityDialogComponent } from './entity-dialog/entity-dialog.component';

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

    dialogValue:string; 
    sendValue:string;
    
    constructor(private fs: FieldService,private  ds:DataService,
            public zone: NgZone,public dialog: MatDialog) {
        ds.getEntityDefList()
            .then(data => {
                this.entityDefs = data;
            });
    }    
    ngOnInit() {
        console.log(`AppComponent.ngOnInit`);
        this.getEntities();
        this.getEntityDefs();
    }
    async getEntities() {
        this.entities = await this.ds.getEntityList();
    }
    async getEntityDefs() {
        this.entityDefs = await this.ds.getEntityDefList();
        console.log(`${JSON.stringify(this.entityDefs)}`);
    }
    async showEntityDialog(uuid:string){
        let entity:IEntity;
        let entityDef:IEntityDef;
        let fieldGroups:string[];
        if(uuid){
            entity = await this.ds.getEntity(uuid).toPromise();
            entityDef= await this.ds.getEntityDef(entity.type);
            fieldGroups= await this.ds.getEntityDefGroups(entity.type);        
        }else{
            entity=new BaseEntity();
            entity.type=this.entityType;
            entityDef= await this.ds.getEntityDef(this.entityType);
            fieldGroups= await this.ds.getEntityDefGroups(this.entityType);
        }
        const dialogRef = this.dialog.open(EntityDialogComponent, {
            backdropClass:'custom-dialog-backdrop-class',
            panelClass:'custom-dialog-panel-class',
            data: {entity:entity,entityDef:entityDef,fieldGroups:fieldGroups}
          });
       
          dialogRef.afterClosed().subscribe(result => {
            console.log(`The dialog was closed ${JSON.stringify(result)}`);
          });
    }
    showEntityDefForm(entityDefType:string){
        this.entityDefType=entityDefType;
        this.isEntityDefFormVisible=true;
    }
    hideEntityForm(status){
//        console.log(`${status}`);
        if(status===true){
            this.refreshEntityList();
        }
        this.isEntityFormVisible=false; 
    }
    hideEntityDefForm(){
        this.isEntityDefFormVisible=false
    }
    async deleteEntity(uuid:string){
        let response = await this.ds.deleteEntity(uuid).toPromise();
        this.refreshEntityList();
    }
    async deleteEntityDef(uuid:string){
        let response = await this.ds.deleteEntity(uuid).toPromise();
        this.refreshEntityDefList();
    }
    refreshEntityList(){
        this.entities=[];
        this.zone.run(async () => this.entities = await this.ds.getEntityList(true));
    }
    refreshEntityDefList(){
        this.entities=[];
        this.zone.run(async () => this.entityDefs = await this.ds.getEntityDefList(true));
    }
    setEntityType(et){
        this.entityType=et;
    }
}
