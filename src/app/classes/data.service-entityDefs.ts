import {HttpHeaders,HttpClient} from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import * as common from './data.service-common';
import {IEntityDef,IPropertyGroup} from './interfaces';

//Caches
let _entityDefList:IEntityDef[];

// Private
let _http:HttpClient;
function  _getEDefs(): Observable<IEntityDef[]> {
    console.log(`CALL _getEDefs`);
    return _http.get<any>(common.endpoint + 'entity-defs').pipe(
            tap((entityDef) => null /* console.log(`data.service.getEDefs()`)*/),
            catchError(common.handleError<any>('getEDefs'))
          );
}
function _getEntityDefList(forceRefresh:boolean=false):Promise<IEntityDef[]>{
    console.log(`CALL _getEntityDefList`);
    return new Promise<IEntityDef[]>(async (resolve,reject)=>{
        if((!_entityDefList || _entityDefList===null) || forceRefresh){
            _entityDefList = await _getEDefs().toPromise();
        }
        resolve(_entityDefList); 
    });
} 
function _deleteEntityDef (euuid): Observable<any> {
    console.log(`CALL _deleteEntityDef`);
    return _http
        .delete<any>(common.endpoint + 'entity-defs/' + euuid, common.httpOptions).pipe(
          tap(_ => null /*console.log(`deleted entityDef.uuid=${euuid}`)*/),
          catchError(common.handleError<any>('deleteEntityDef'))
        );        
  }
function _getEntityDefGroups(type:string):Promise<string[]>{
    console.log(`CALL _getEntityDefGroups`);
    return new Promise<string[]>(async (resolve,reject)=>{
        let groupNames:string[]=[];

        if(!_entityDefList){
            _entityDefList = await _getEDefs().toPromise();
        }
        let entityDef:IEntityDef;
        for(let i=0;i<_entityDefList.length;i++){
            if(_entityDefList[i].name==type){
                entityDef=_entityDefList[i];
            }
        }
        let groups:IPropertyGroup[]=entityDef.groups;
        groups.sort((a, b) => a.order - b.order);
        groups.forEach((g)=>{
            groupNames.push(g.name);
        });
        resolve(groupNames);
    });
}
function _getEntityDef(type:string):Promise<IEntityDef>{
    console.log(`CALL _getEntityDef`);
    return new Promise<IEntityDef>(async (resolve,reject)=>{
        if(!_entityDefList){
            _entityDefList = await _getEDefs().toPromise();
        }
        let entityDef:IEntityDef;
        for(let i=0;i<_entityDefList.length;i++){
            if(_entityDefList[i].name==type){
                entityDef=_entityDefList[i];
            }
        }
        if(entityDef){
            resolve(entityDef);
        }else{
            reject();
        }
    });
}

// Exports
export const setHttpClient=(http)=>{_http=http;console.log(`set EntityDefSvc.HttpClient`);}
export const getEntityDefList=_getEntityDefList;
export const deleteEntityDef=_deleteEntityDef;
export const getEntityDefGroups=_getEntityDefGroups;
export const getEntityDef=_getEntityDef;
