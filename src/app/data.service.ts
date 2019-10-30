import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, EMPTY, observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {IEntityDef} from './classes/IEntityDef';
import {IEntity} from './classes/IEntity';
import {IPropertyGroup} from './classes/IPropertyGroup';

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
        console.log(`httpClientError: ${JSON.stringify(result)}`);
        return (error: any): Observable<T> => {
    
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
    
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);
    
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
    
    private getEntities(): Observable<any> {
        return this.http.get<any>(this.endpoint + 'entities').pipe(
            tap((entity) => console.log(`data.service.getEntities()`)),
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
}
