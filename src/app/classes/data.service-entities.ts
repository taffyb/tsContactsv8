import {HttpHeaders,HttpClient} from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import * as common from './data.service-common';
import {IEntity, IEntityLite} from './interfaces';

//Caches
let _entityList:IEntityLite[];
let _entityLiteMap:{}={};
let _entityMap:{}={};
let _entityLiteMapByType:{};

// Private
let _http:HttpClient;
function _getEntities(): Observable<IEntityLite[]>{
    console.log(`CALL _getEntities`);
    const entities$= _http.get<any>(common.endpoint + 'entities').pipe(
        tap((entity) =>null /* console.log(`data.service.getEntities()`)*/),
        catchError(common.handleError<any>('getEntities'))
     );
    //create the two caches asynchronously so it doesn't hold anything up.
    //
    //1. create a map of all the entities by type so we can easily access by uuid.
    //   entityLiteMapByType{type:[{uuid:string,type:string,display:string}]}
    let y=new Promise(async (resolve,reject)=>{
        let entities = await entities$.toPromise();
        resolve(entities)
    }).then((res:IEntityLite[])=>{
        _entityLiteMapByType={};
        res.forEach(e=>{
            if(!_entityLiteMapByType[e.type]){
                _entityLiteMapByType[e.type]=[];
            }
            _entityLiteMapByType[e.type].push(e);
        });
    });
    //2. create a map of all the entities so we can easily access by uuid.
    //   entityLiteMap{uuid:{uuid:string,type:string,display:string}}
    let x=new Promise(async (resolve,reject)=>{
        let entities = await entities$.toPromise();
        resolve(entities)
    }).then((res:IEntityLite[])=>{
        _entityLiteMap={};
        res.forEach(e=>{
            _entityLiteMap[e.uuid]=e;
        });
    });
    return entities$;
}
function _getEntityList(forceRefresh:boolean=false):Promise<IEntityLite[]>{
    console.log(`CALL _getEntityList`);
    return new Promise<IEntityLite[]>(async (resolve,reject)=>{
        //if the cache is undefined or forceRefresh=true then load from database
        if((!_entityList || _entityList===null) || forceRefresh){
            _entityList = await _getEntities().toPromise();
        }
        resolve(_entityList);
     });
}
function  _getLiteEntity(uuid): IEntityLite {
    console.log(`CALL _getLiteEntity`);
    return _entityLiteMap[uuid];
}
function _getEntity(uuid): Observable<IEntity> {    
    console.log(`CALL _getEntity`);  
    return new Observable<IEntity>((observer) => {
        if(!_entityMap[uuid]){
            _http.get<IEntity>(common.endpoint + 'entities/' + uuid).subscribe(e=>{
                _entityMap[uuid]=e;
                observer.next(_entityMap[uuid]);
                observer.complete();
            });
        }else{
            observer.next(_entityMap[uuid]);
            observer.complete();
        }
      });        
}
function _addEntity (entity:IEntity): Observable<IEntity> {
    console.log(`CALL _addEntity`);
    const result$=_http
    .post(common.endpoint + 'entities', JSON.stringify(entity), common.httpOptions).pipe(
        tap((result:any) => {                    
            console.log(`added entity:${JSON.stringify(result)}`);
        }),
        catchError(common.handleError<any>('addEntity'))
      );

    return result$;
}
function _updateEntity (entity:IEntity): Observable<any> {
    console.log(`CALL _updateEntity`);
    _entityMap[entity.uuid]=entity;
    return _http
        .put(common.endpoint + 'entities/' + entity.uuid, JSON.stringify(entity), common.httpOptions).pipe(
            tap((result) => {null;console.log(`updated entity  id=${entity.uuid}`)}),
            catchError(common.handleError<any>('updateEntity'))
          );
}
function _deleteEntity (uuid): Observable<any> {
    console.log(`CALL _deleteEntity`);
    delete _entityMap[uuid];
    
    _entityList=null;
    return _http
        .delete<any>(common.endpoint + 'entities/' + uuid, common.httpOptions).pipe(
          tap(_ => {null;console.log(`deleted entity.uuid=${uuid}`)}),
          catchError(common.handleError<any>('deleteEntity'))
        );        
}
function _uploadEntityTemplate(files:File[]): Observable<any> {
    console.log(`CALL _uploadEntityTemplate`);
    const httpOptions:any = {
            headers: new HttpHeaders({"Content-Type":"text/plain"})
    };
    return _http
        .post(common.endpoint + 'template', files, httpOptions).pipe(
            tap((result) => null /*console.log(`added entity`)*/),
            catchError(common.handleError<any>('uploadEntityTemplate'))
    );
}
// Exports
export const setHttpClient=(http)=>{_http=http;console.log(`set EntitySvc.HttpClient`);}
export const getEntities=_getEntities;
export const getEntityList=_getEntityList;
export const getLiteEntity=_getLiteEntity;
export const getEntity=_getEntity;
export const addEntity=_addEntity;
export const updateEntity=_updateEntity;
export const deleteEntity=_deleteEntity;
export const uploadEntityTemplate=_uploadEntityTemplate;

