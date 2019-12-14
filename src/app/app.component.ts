import { Component, NgZone, OnInit} from '@angular/core';
import { Observable, of} from 'rxjs';
import { delay, share } from 'rxjs/operators';

import { FieldService } from './field.service';
import { DataService } from './data.service';
import {IEntityDef, IEntity, IEntityLite ,IRelationship} from './classes/interfaces';
import {BaseEntity} from './classes/BaseEntity';
import {BaseRelationship} from './classes/BaseRelationship';

import { MatDialog } from '@angular/material';
import { ModalDialog, DialogOptions } from './modal-dialog/modal-dialog';
import { EntityDefDialogComponent } from './entity-def-dialog/entity-def-dialog.component';
import { RelationshipDialogComponent } from './relationship-dialog/relationship-dialog.component';
import { EntityDialogComponent } from './entity-dialog/entity-dialog.component';
import { EntityUploadDialogComponent } from './entity-upload-dialog/entity-upload-dialog.component';
import {Data} from './data/data';
import {DataModel} from './classes/data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    entityType:string="Person";
    entityTypeUuid:string="";
    entityDefType:string="Person";
    entities:{options:{},entity:IEntityLite}[]=[];
    entityDefs:IEntityDef[];
    do=DialogOptions;
    data$:Observable<DataModel>;//=Data;
    dialogOpen:boolean=false;

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
        let entities:IEntityLite[];
        this.entities=[];
        entities = await this.ds.getEntityList(true);
        
        entities.forEach(e=>{
            this.entities.push({options:{check:false},entity:e});
        });
        this.data$ = this.getAsyncData();
    }
    getAsyncData(){
        let data:DataModel={nodes:[],links:[]};
        this.entities.forEach((e,i)=>{
            data.nodes.push({uuid:e.entity.uuid,type:e.entity.type,label:e.entity.display,reflexive:false});
//            console.log(`entity[${i}]: ${JSON.stringify(e)}`);
        });
        return of(data);
    }
    async getEntityDefs() {
        this.entityDefs = await this.ds.getEntityDefList();
    }
    async showRelationshipDialog(rel:any){
        let relationship:IRelationship;
        const source = await this.ds.getEntity(rel.sourceUuid).toPromise();
        const target = await this.ds.getEntity(rel.targetUuid).toPromise();
        relationship=new BaseRelationship();
        relationship.source=source;
        relationship.target=target;  
        relationship.label=rel.label;
        if(rel.uuid){ 
            relationship.uuid=rel.uuid;
        }
        const labels = await this.ds.getRelationshipTypes(source.type, target.type).toPromise();

        console.log(`labels:${JSON.stringify(labels)}`);
        const dialogRef = this.dialog.open(RelationshipDialogComponent, {
            backdropClass:'custom-dialog-backdrop-class',
            panelClass:'custom-dialog-panel-class',
            data: {relationship:relationship,labels:labels}
          });
        dialogRef.disableClose=true;
        dialogRef.afterClosed().subscribe(async result => {
            if(result.data!=null){
                console.log(`showRelationshipDialog.close ${JSON.stringify(result.data)}`);
                this.zone.run(() =>this.dialogOpen=false);          
            }
        });
    }
    async showEntityDialog(uuid:string){
        this.dialogOpen=true;
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
                for(let key in result.data){
                    entity.props.push({key:key,value:result.data[key]});
                }
                if(uuid){
                   await this.ds.updateEntity(entity).toPromise();
                }else{
                   await this.ds.addEntity(entity).toPromise();
                } 
                this.refreshEntityList();
                this.zone.run(() =>this.dialogOpen=false);          
            }
        });
    }
    showEntityUploadDialog(){
        this.dialogOpen=true;
        const dialogRef = this.dialog.open(EntityUploadDialogComponent, {
            backdropClass:'custom-dialog-backdrop-class',
            panelClass:'custom-dialog-panel-class',
            data: {}
          });
       
          dialogRef.afterClosed().subscribe(result => {
              if(result.data !== null){
                  this.refreshEntityList();
              }else{
//                  console.log(`The dialog was canceled`);
              }  
              this.zone.run(() =>this.dialogOpen=false);         
          });
    }
    async showEntityDefDialog(entityDefType:string){
        this.dialogOpen=true;
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
              this.zone.run(() =>this.dialogOpen=false);
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
        this.zone.run(()=> {
            this.getEntities();
            this.data$ = this.getAsyncData();
        });
    }
    refreshEntityDefList(){
        this.zone.run(async () => this.entityDefs = await this.ds.getEntityDefList(true));
    }
    setEntityType(et){
        this.entityType=et;
    }
    openDialog(message:string,options:number): void {
        this.dialogOpen=true;
        const dialogRef = this.dialog.open(ModalDialog, {
          width: '300px',
          backdropClass:'custom-dialog-backdrop-class',
          panelClass:'custom-dialog-panel-class',
          data: {message: message,
                 dialogOptions:options
                }
        });
     
        dialogRef.afterClosed().subscribe(result => {
//          console.log('The dialog was closed',result.data);
          this.dialogValue = result.data;
          this.zone.run(() =>this.dialogOpen=false);
        });
      }
    async openEntityTemplate(entityType:string){
        const e= await this.ds.getEntityDef(entityType);

        window.location.href = `http://localhost:4001/api/template/${e.uuid}`;
    }
}
