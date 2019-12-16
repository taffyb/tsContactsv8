import {IEntity, IRelationship} from './interfaces';

export interface DataModel {
  nodes: Node[];
  links: Link[];
}

export interface Node{
    id?:number,
    reflexive:boolean,
	uuid:string,
	type:string,
	label:string,
	x?:number,
	y?:number
}
export interface Link{
    uuid:string,
	source:Node,
	target:Node,
	label:string,
	value?:number,
	left:boolean,
	right:boolean,
	linkNum?:number
}