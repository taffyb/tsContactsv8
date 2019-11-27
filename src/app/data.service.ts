import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, EMPTY, observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {IEntityDef, IEntity, IPropertyGroup} from './classes/interfaces';

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
    entityDefList:IEntityDef[];
    entityList:IEntity[];
    
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
    
    private getEntities(): Observable<IEntity[]> {
        return this.http.get<any>(this.endpoint + 'entities').pipe(
            tap((entity) =>null /* console.log(`data.service.getEntities()`)*/),
            catchError(this.handleError<any>('getEntities'))
          );
    }

    getEntityList(forceRefresh:boolean=false):Promise<IEntity[]>{
        return new Promise<IEntity[]>(async (resolve,reject)=>{
            if((!this.entityList || this.entityList===null) || forceRefresh){
                this.entityList = await this.getEntities().toPromise();
            }
            resolve(this.entityList);
        });
    }

    getEntity(uuid): Observable<IEntity> {
        return this.http.get<IEntity>(this.endpoint + 'entities/' + uuid);
    }
    
    addEntity (entity:IEntity): Observable<any> {
//        console.log(`addEntity: ${JSON.stringify(entity)}`);
        return  this.http
            .post(this.endpoint + 'entities', JSON.stringify(entity), this.httpOptions).pipe(
                tap((result) => null/*console.log(`added entity`)*/),
                catchError(this.handleError<any>('addEntity'))
              );
      }
    updateEntity (entity:IEntity): Observable<any> {
//        console.log(`updateEntity: ${JSON.stringify(entity)}`);
        return this.http
            .put(this.endpoint + 'entities/' + entity.uuid, JSON.stringify(entity), this.httpOptions).pipe(
                tap((result) => null/*console.log(`updated entity  id=${entity.uuid}`)*/),
                catchError(this.handleError<any>('updateEntity'))
              );
      }
    deleteEntity (euuid): Observable<any> {
        this.entityList=null;
        return this.http
            .delete<any>(this.endpoint + 'entities/' + euuid, this.httpOptions).pipe(
              tap(_ => null /*console.log(`deleted entity.uuid=${euuid}`)*/),
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

        