import {IRelationship,IEntity} from './interfaces';

export class BaseRelationship implements IRelationship{
    uuid:string;
    source:string;
    target:string; 
    label:string;
    left:boolean;
    right:boolean;
}