import { Component, NgZone, OnInit} from '@angular/core';


import { FieldService } from './field.service';
import { DataService } from './data.service';
import {IEntityDef} from './classes/IEntityDef';
import {IEntity} from './classes/IEntity';
import {BaseEntity} from './classes/BaseEntity';

import { MatDialog } from '@angular/material';
import { ModalDialog, DialogOptions } from './modal-dialog/modal-dialog';
import { EntityDefDialogComponent } from './entity-def-dialog/entity-def-dialog.component';
import { EntityDialogComponent } from './entity-dialog/entity-dialog.component';
import { EntityUploadDialogComponent } from './entity-upload-dialog/entity-upload-dialog.component';
import {Data} from './data/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    entityType:string="Person";
    entityTypeUuid:string="";
    entityDefType:string="Person";
    entities:{options:{},entity:IEntity}[]=[];
    entityDefs:IEntityDef[];
    do=DialogOptions;
    data=Data;

    dialogValue:string; 
    sendValue:string;
    
    constructor(private fs: FieldService,private  ds:DataService,
            public zone: NgZone,public dialog: MatDialog) {
    }    
    ngOnInit() {
        this.getEntities();
        this.getEntityDefs();
    }
    async getEntities() {
        let entities:IEntity[];
        this.entities=[];
        entities = await this.ds.getEntityList(true);
        entities.forEach(e=>{
            this.entities.push({options:{check:false},entity:e});
        });
    }
    async getEntityDefs() {
        this.entityDefs = await this.ds.getEntityDefList();
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
        dialogRef.disableClose=true;
        dialogRef.afterClosed().subscribe(async result => {
            if(result.data!=null){
                entity.props=[];
                console.log(`result.data: ${JSON.stringify(result.data)}`);
                for(let key in result.data){
                    entity.props.push({key:key,value:result.data[key]});
                }
                if(uuid){
                   await this.ds.updateEntity(entity).toPromise();
                }else{
                   await this.ds.addEntity(entity).toPromise();
                } 
                this.refreshEntityList();               
            }
        });
    }
    showEntityUploadDialog(){
        const dialogRef = this.dialog.open(EntityUploadDialogComponent, {
            backdropClass:'custom-dialog-backdrop-class',
            panelClass:'custom-dialog-panel-class',
            data: {}
          });
       
          dialogRef.afterClosed().subscribe(result => {
              if(result.data !== null){
                  this.refreshEntityList();
              }else{
                  console.log(`The dialog was canceled`);
              }            
          });
    }
    async showEntityDefDialog(entityDefType:string){
        let entityDef:IEntityDef;
        let fieldGroups:string[];
        entityDef= await this.ds.getEntityDef(entityDefType);
        fieldGroups= await this.ds.getEntityDefGroups(entityDefType);
        

        const dialogRef = this.dialog.open(EntityDefDialogComponent, {
            backdropClass:'custom-dialog-backdrop-class',
            panelClass:'custom-dialog-panel-class',
            data: {entityDef:entityDef,fieldGroups:fieldGroups}
          });
       
          dialogRef.afterClosed().subscribe(result => {
            console.log(`The dialog was closed ${JSON.stringify(result)}`);
          });
    }
    async deleteEntity(uuid:string){
        let response = await this.ds.deleteEntity(uuid).toPromise();
        this.refreshEntityList();
    }
    async deleteEntityDef(uuid:string){
        let response = await this.ds.deleteEntityDef(uuid).toPromise();
        this.refreshEntityDefList();
    }
    refreshEntityList(){
//        this.entities=[];
//        this.zone.run(async () => this.entities = await this.ds.getEntityList(true));
        this.zone.run(async ()=> this.getEntities());
    }
    refreshEntityDefList(){
//        this.entityDefs=[];
        this.zone.run(async () => this.entityDefs = await this.ds.getEntityDefList(true));
    }
    setEntityType(et){
        this.entityType=et;
    }
    openDialog(message:string,options:number): void {
        const dialogRef = this.dialog.open(ModalDialog, {
          width: '300px',
          backdropClass:'custom-dialog-backdrop-class',
          panelClass:'custom-dialog-panel-class',
          data: {message: message,
                 dialogOptions:options
                }
        });
     
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed',result.data);
          this.dialogValue = result.data;
        });
      }
    async openEntityTemplate(entityType:string){
        const e= await this.ds.getEntityDef(entityType);

        window.location.href = `http://localhost:4001/api/template/${e.uuid}`;
    }
}
