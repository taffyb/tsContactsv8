export interface DataModel {
  nodes: Node[];
  links: Link[];
}

interface Node{
    id?:number,
    reflexive:boolean,
	uuid:string,
	type?:string,
	label?:string,
	x?:number,
	y?:number
}
interface Link{
	source:string,
	target:string,
	label:string,
	value:number,
	left:boolean,
	right:boolean
}