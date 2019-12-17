import {HttpHeaders,HttpClient} from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import * as common from './data.service-common';
import {IRelationship} from './interfaces';

//Caches


// Private
let _http:HttpClient;
function _getAllRelationships(): Observable<IRelationship[]> {
    console.log(`CALL _getAllRelationships`);
    return _http.get<IRelationship[]>(common.endpoint + 'relationships');
}
function _getRelationship(uuid): Observable<IRelationship> {
    console.log(`CALL _getRelationship`);
    return _http.get<IRelationship>(`${common.endpoint}relationships/${uuid}`);
}
function _getRelationshipTypes(sourceType:string,targetType:string): Observable<string[]> {
    console.log(`CALL _getRelationshipTypes`);
    return _http.get<string[]>(`${common.endpoint}relationships?types=${sourceType}&types=${targetType}`);
}
// Exports
export const setHttpClient=(http)=>{_http=http;console.log(`set RelSvc.HttpClient`);}
export const getAllRelationships=_getAllRelationships;
export const getRelationship=_getRelationship;
export const getRelationshipTypes=_getRelationshipTypes;

