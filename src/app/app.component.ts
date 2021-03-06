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
    relationships:IRelationship[]=[];
    entityDefs:IEntityDef[];
    do=DialogOptions;
    data$:Observable<DataModel>;
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
        this.relationships= await this.ds.getAllRelationships().toPromise();
        
        entities.forEach(e=>{
            this.entities.push({options:{check:false},entity:e});
        });
        this.data$ = this.getAsyncData();
    }
    getAsyncData():Observable<DataModel>{
        let data:DataModel={nodes:[],links:[]};
        this.entities.forEach((e,i)=>{
            data.nodes.push({uuid:e.entity.uuid,type:e.entity.type,label:e.entity.display,reflexive:false});
        });
        this.relationships.forEach((r)=>{
            let source:IEntityLite=this.ds.getLiteEntity(r.source);
            let target:IEntityLite=this.ds.getLiteEntity(r.target);
            let link={uuid:r.uuid,
                    source:{uuid:source.uuid,type:source.type,label:source.display,reflexive:false},
                    target:{uuid:target.uuid,type:target.type,label:target.display,reflexive:false},
                    label:r.label,
                    left:r.left,
                    right:r.right};
            data.links.push(link);
        });
        return of(data);
    }
    async getEntityDefs() {
        this.entityDefs = await this.ds.getEntityDefList();
    }
    async showRelationshipDialog(rel:IRelationship){
        let relationship:IRelationship; 
        const source = await this.ds.getEntity(rel.source).toPromise();
        const target = await this.ds.getEntity(rel.target).toPromise();
        relationship=new BaseRelationship();
        relationship.source=rel.source;
        relationship.target=rel.target;   
        relationship.label=rel.label;
        if(rel.uuid){ 
            relationship.uuid=rel.uuid;
        }
        const labels = await this.ds.getRelationshipTypes(source.type, target.type).toPromise();

        console.log(`labels:${JSON.stringify(labels)}`);
        const dialogRef = this.dialog.open(RelationshipDialogComponent, {
            backdropClass:'custom-dialog-backdrop-class',
            panelClass:'custom-dialog-panel-class',
            data: {relationship:relationship,source:source,target:target,labels:labels}
          });
        dialogRef.disableClose=true;
        dialogRef.afterClosed().subscribe(async result => {
            console.log(`Relationship: ${JSON.stringify(result.data)}`);
            if(result.data!=null){
                let relationship:IRelationship=result.data;
                if(relationship.uuid){
                   await this.ds.updateRelationship(relationship).toPromise();
                }else{
                   await this.ds.addRelationship(relationship).toPromise();
                } 
                this.refreshEntityList();
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
        console.log(`uuid:[${uuid}] entity:${JSON.stringify(entity)}`);
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
