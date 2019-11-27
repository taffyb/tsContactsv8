import {IEntity, IProp} from './interfaces';

export class BaseEntity implements IEntity{
    type:string="";
    uuid:string="";
    display:string="";
    icon:string="";
    props:IProp[]=[];
}