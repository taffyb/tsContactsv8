import {IRelationship,IEntity} from './interfaces';

export class BaseRelationship implements IRelationship{
    uuid:string;
    source:IEntity;
    target:IEntity; 
    label:string;
    left:boolean;
    right:boolean;
}