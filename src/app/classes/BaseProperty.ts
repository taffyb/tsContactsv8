import {IProperty} from './interfaces';

export class BaseProperty implements IProperty{
    name: string="";
    type: string="";
    label: string="";
    required: boolean=false;
    order: number=10;

    constructor(){
        
    }
}