import {IEntity} from './IEntity';

export interface IRelationship{
    fromEntity:IEntity;
    toEntity:IEntity;
    label:string;
}