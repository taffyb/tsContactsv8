import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {IEntityDef, IEntity, IEntityLite, IPropertyGroup, IRelationship} from './classes/interfaces';
import {DataModel} from './classes/data.model';
import * as common from './classes/data.service-common';
import * as entitySvc from './classes/data.service-entities';
import * as entityDefSvc from './classes/data.service-entityDefs';
import * as relSvc from './classes/data.service-relationships';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    endpoint=common.endpoint;
    httpOptions=common.httpOptions;
    
    constructor(private http: HttpClient) {
        entitySvc.setHttpClient(http);
        entityDefSvc.setHttpClient(http);
        relSvc.setHttpClient(http);
    }
   
    //Entity Data Service functions
    getEntities(){return entitySvc.getEntities();}
    getEntityList(forceRefresh:boolean=false){return entitySvc.getEntityList(forceRefresh);}
    getLiteEntity(uuid:string){return entitySvc.getLiteEntity(uuid);}
    getEntity(uuid:string){return entitySvc.getEntity(uuid);}
    addEntity (entity:IEntity){return entitySvc.addEntity(entity);}
    updateEntity (entity:IEntity){return entitySvc.updateEntity(entity);}
    deleteEntity (uuid:string){return entitySvc.deleteEntity(uuid);}
    uploadEntityTemplate(files:File[]){return entitySvc.uploadEntityTemplate(files);}
    
    //EntityDef Data Service functions
    getEntityDefList(forceRefresh:boolean=false){ return entityDefSvc.getEntityDefList(forceRefresh);}
    deleteEntityDef (uuid:string){return entityDefSvc.deleteEntityDef(uuid);}
    getEntityDefGroups(type:string){return entityDefSvc.getEntityDefGroups(type);}
    getEntityDef(type:string){return entityDefSvc.getEntityDef(type);}

    //Relationship Data Service Functions
    getAllRelationships(){return relSvc.getAllRelationships();}
    getRelationship(uuid:string,sourceUuid:string,targetUuid:string){return relSvc.getRelationship(uuid,sourceUuid,targetUuid);}
    getRelationshipTypes(sourceType:string,targetType:string){return relSvc.getRelationshipTypes(sourceType,targetType);}
 
}

        