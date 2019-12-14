import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, EMPTY, observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {IEntityDef, IEntity, IEntityLite, IPropertyGroup} from './classes/interfaces';
import {DataModel} from './classes/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    endpoint:string = 'http://localhost:4001/api/';
    httpOptions:any = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    //cache 
    entityDefList:IEntityDef[];
    entityList:IEntityLite[];
    entityMap:{}={};
    entityLiteMapByType:{};
    
    constructor(private http: HttpClient) {
    }
    
    private handleError<T> (operation = 'operation', result?: T) {
//        console.log(`httpClientError: ${JSON.stringify(result)}`);
        return (error: any): Observable<T> => {
    
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
    
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);
    
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
    
    private getEntities(): Observable<IEntityLite[]> {
        const entities$= this.http.get<any>(this.endpoint + 'entities').pipe(
            tap((entity) =>null /* console.log(`data.service.getEntities()`)*/),
            catchError(this.handleError<any>('getEntities'))
         );
        //create the two caches asynchronously so it doesn't hold anything up.
        //
        //1. create a map of all the entities so we can easily access by uuid.
        //   entityLiteMapByType{type:[{uuid:string,type:string,display:string}]}
        let y=new Promise(async (resolve,reject)=>{
            let entities = await entities$.toPromise();
            resolve(entities)
        }).then((res:IEntityLite[])=>{
            this.entityLiteMapByType={};
            res.forEach(e=>{
                if(!this.entityLiteMapByType[e.type]){
                    this.entityLiteMapByType[e.type]=[];
                }
                this.entityLiteMapByType[e.type].push(e);
            });
//            console.log(`getEntities transform to MapByType:${JSON.stringify(this.entityLiteMapByType)}`);
        });
        return entities$;
    }

    getEntityList(forceRefresh:boolean=false):Promise<IEntityLite[]>{
        return new Promise<IEntityLite[]>(async (resolve,reject)=>{
            //if the cache is undefined or forceRefresh=true then load from database
            if((!this.entityList || this.entityList===null) || forceRefresh){
                this.entityList = await this.getEntities().toPromise();
            }
            resolve(this.entityList);
         });
    }

    getEntity(uuid): Observable<IEntity> {      
        return new Observable<IEntity>((observer) => {
            if(!this.entityMap[uuid]){
                this.http.get<IEntity>(this.endpoint + 'entities/' + uuid).subscribe(e=>{
                    this.entityMap[uuid]=e;
//                    console.log(`add to entityMap[${uuid}]:${JSON.stringify(this.entityMap[uuid])}`);
                    observer.next(this.entityMap[uuid]);
                    observer.complete();
                });
            }else{
//                console.log(`get from entityMap[${uuid}]:${JSON.stringify(this.entityMap[uuid])}`);
                observer.next(this.entityMap[uuid]);
                observer.complete();
            }
          });        
    }
    
    addEntity (entity:IEntity): Observable<IEntity> {
//        console.log(`addEntity: ${JSON.stringify(entity)}`);
        const result$=  this.http
            .post(this.endpoint + 'entities', JSON.stringify(entity), this.httpOptions).pipe(
                tap((result:any) => {                    
                    console.log(`added entity:${JSON.stringify(result)}`);
//                    this.entityMap[entity.uuid]=entity;
                }),
                catchError(this.handleError<any>('addEntity'))
              );
        
        return result$;
      }
    updateEntity (entity:IEntity): Observable<any> {
        this.entityMap[entity.uuid]=entity;
        return this.http
            .put(this.endpoint + 'entities/' + entity.uuid, JSON.stringify(entity), this.httpOptions).pipe(
                tap((result) => {null;console.log(`updated entity  id=${entity.uuid}`)}),
                catchError(this.handleError<any>('updateEntity'))
              );
      }
    deleteEntity (uuid): Observable<any> {
        delete this.entityMap[uuid];
        
        this.entityList=null;
        return this.http
            .delete<any>(this.endpoint + 'entities/' + uuid, this.httpOptions).pipe(
              tap(_ => {null;console.log(`deleted entity.uuid=${uuid}`)}),
              catchError(this.handleError<any>('deleteEntity'))
            );        
      }
    private getEDefs(): Observable<IEntityDef[]> {
        return this.http.get<any>(this.endpoint + 'entity-defs').pipe(
                tap((entityDef) => null /* console.log(`data.service.getEDefs()`)*/),
                catchError(this.handleError<any>('getEDefs'))
              );
    }
    getEntityDefList(forceRefresh:boolean=false):Promise<IEntityDef[]>{
        return new Promise<IEntityDef[]>(async (resolve,reject)=>{
            if((!this.entityDefList || this.entityDefList===null) || forceRefresh){
                this.entityDefList = await this.getEDefs().toPromise();
            }
            resolve(this.entityDefList); 
        });
    }   
    deleteEntityDef (euuid): Observable<any> {
        this.entityList=null;
        return this.http
            .delete<any>(this.endpoint + 'entity-defs/' + euuid, this.httpOptions).pipe(
              tap(_ => null /*console.log(`deleted entityDef.uuid=${euuid}`)*/),
              catchError(this.handleError<any>('deleteEntity'))
            );        
      }
    
    getEntityDefGroups(type:string):Promise<string[]>{
        return new Promise<string[]>(async (resolve,reject)=>{
            let groupNames:string[]=[];
    
            if(!this.entityDefList){
                this.entityDefList = await this.getEDefs().toPromise();
            }
            let entityDef:IEntityDef;
            for(let i=0;i<this.entityDefList.length;i++){
                if(this.entityDefList[i].name==type){
                    entityDef=this.entityDefList[i];
                }
            }
            let groups:IPropertyGroup[]=entityDef.groups;
            groups.sort((a, b) => a.order - b.order);
            groups.forEach((g)=>{
                groupNames.push(g.name);
            });
//            console.log(`entityDefs.groups: ${JSON.stringify(groupNames)}`);
            resolve(groupNames);
        });
    }
    getEntityDef(type:string):Promise<IEntityDef>{
        return new Promise<IEntityDef>(async (resolve,reject)=>{
            if(!this.entityDefList){
                this.entityDefList = await this.getEDefs().toPromise();
            }
            let entityDef:IEntityDef;
            for(let i=0;i<this.entityDefList.length;i++){
                if(this.entityDefList[i].name==type){
                    entityDef=this.entityDefList[i];
                }
            }
            if(entityDef){
                resolve(entityDef);
            }else{
                reject();
            }
        });
    }
    getRelationships(uuid): Observable<IEntity> {
        return this.http.get<IEntity>(this.endpoint + 'relationships');
    }
    getRelationshipTypes(sourceType:string,targetType:string): Observable<string[]> {
        console.log(`data Service GET ${this.endpoint}relationships?types=${sourceType}&types=${targetType}`);
        return this.http.get<string[]>(`${this.endpoint}relationships?types=${sourceType}&types=${targetType}`);
    }
    
    uploadEntityTemplate(files:File[]): Observable<any> {
                
        const httpOptions:any = {
                headers: new HttpHeaders({"Content-Type":"text/plain"})
        };
        return this.http
            .post(this.endpoint + 'template', files, httpOptions).pipe(
                tap((result) => null /*console.log(`added entity`)*/),
                catchError(this.handleError<any>('addEntity'))
        );
    }
}

        