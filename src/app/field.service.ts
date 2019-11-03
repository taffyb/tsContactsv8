import { Injectable } from '@angular/core';

import { DropdownField } from './classes/field-dropdown';
import { FieldBase }     from './classes/field-base';
import { TextboxField }  from './classes/field-textbox';
import { CheckboxField }  from './classes/field-checkbox';
import { TextareaField }  from './classes/field-textarea';
import { HLineField }  from './classes/field-hr';

import {IEntityDef} from './classes/IEntityDef';
import {IEntity} from './classes/IEntity';
import {IProperty} from './classes/IProperty';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor() { }
  
  getEntityDefFields(entityDef:IEntityDef):FieldBase<any>[] {
    let fields: FieldBase<any>[] = [];  
    let defProps={};

    entityDef.groups.forEach(group=>{
        group.props.forEach(prop=>{
            let order:number= Number(group.order.toString()+prop.order.toString());
            defProps[prop.name]={group:group.name,name:prop.name,type:prop.type,label:prop.label,order:order,required:prop.required};

          console.log(`defProps[${prop.name}]:${JSON.stringify(defProps[prop.name])}`);
        });
    });

//    console.log(`FieldService.getFields entity: ${JSON.stringify(entity)}\n entityDef: ${JSON.stringify(defProps)}`);
    for(let key in defProps){
        let field:FieldBase<any>;
        field= this.contactdb2PropertyType(defProps[key],defProps[key]['group']);
        console.log(`FieldService.getFields field: ${JSON.stringify(field)}`);
        fields.push(field);
    }
    return fields;
  }

  getEntityFields(entityDef:IEntityDef,entity:IEntity):FieldBase<any>[] {

    let fields: FieldBase<any>[] = [];  
    let defProps={};


    entityDef.groups.forEach(group=>{
        group.props.forEach(prop=>{
            let order:number= Number(group.order.toString()+prop.order.toString());
            defProps[prop.name]={group:group.name,name:prop.name,type:prop.type,label:prop.label,order:order,required:prop.required};

//          console.log(`defProps[${prop.name}]:${JSON.stringify(defProps[prop.name])}`);
        });
    });

//    console.log(`FieldService.getFields entity: ${JSON.stringify(entity)}\n entityDef: ${JSON.stringify(defProps)}`);
    for(let key in defProps){
        let field:FieldBase<any>;
        if(entity){
            field= this.contactdb2PropertyType(defProps[key],defProps[key]['group'],entity.props[key]);
            delete entity.props[key];
        }else{
            
            field= this.contactdb2PropertyType(defProps[key],defProps[key]['group']);
            console.log(`FieldService.getFields field: ${JSON.stringify(field)}`);
        }
        fields.push(field);
    }
    if(entity){
        for(let key in entity.props){
            if(key !=='uuid'){
                let field:FieldBase<any> = this.contactdb2PropertyType(key,'Default',entity.props[key]);
                fields.push(field);
            }
         }
    }
    
    return fields.sort((a, b) => a.order - b.order);
  }
  
  contactdb2PropertyType(p,group:string=null,val:any=""):FieldBase<any>{
      let rtn:FieldBase<any>;

      if(typeof p === 'object'){
          switch(p.type){
          case "string":
              rtn=new TextboxField({
                   key:p.name,
                   value:val,
                   label:p.label || p.name,
                   order:p.order,
                   required:!!p.required});
              break;
          case "date":
              rtn=new TextboxField({
                  key:p.name,
                  value:val,
                  label:p.label || p.name,
                  order:p.order,
                  type:"date",
                  required:!!p.required});
              break;
          case "email":
              rtn=new TextboxField({
                  key:p.name,
                  value:val,
                  label:p.label || p.name,
                  order:p.order,
                  type:"email",
                  required:!!p.required});
              break;
          case "memo":
              rtn=new TextareaField({
                  key:p.name,
                  value:val,
                  label:p.label || p.name,
                  order:p.order,
                  type:"date",
                  required:!!p.required});
              break;
          case "true-false":
              rtn=new CheckboxField({
                  key:p.name,
                  value:val,
                  label:p.label || p.name,
                  order:p.order,
                  required:!!p.required});
              break; 
          }
          rtn.group=group;
      }else{
          rtn=new TextboxField({
              key:p,
              value:val,
              label:p,
              order:999});
      }
    
      return rtn;
  }
}
