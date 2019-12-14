import { Injectable } from '@angular/core';

import { DropdownField } from './classes/field-dropdown';
import { FieldBase }     from './classes/field-base';
import { TextboxField }  from './classes/field-textbox';
import { CheckboxField }  from './classes/field-checkbox';
import { TextareaField }  from './classes/field-textarea';
import { HLineField }  from './classes/field-hr';

import {IEntityDef, IEntity, IProperty} from './classes/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor() { }
  
  getEntityDefFields(entityDef:IEntityDef):FieldBase<any>[][] {
    let allFields:any[][] = [];  
    let defProps={};
    let groups=[];

    entityDef.groups.forEach(group=>{
        groups.push({key:group.name,value:group.name});
        group.props.forEach(prop=>{
//            let order:number= Number(group.order.toString()+prop.order.toString());
        let order:number= prop.order;
            defProps[prop.name]={group:group.name,name:prop.name,type:prop.type,label:prop.label,order:order,required:prop.required};
        });
    });
    for(let key in defProps){
        let fields:FieldBase<any>[];
        fields= this.fieldsForEntityDefProperty(defProps[key],groups);
        allFields.push(fields);
    }
    return allFields;
  }

  getEntityFields(entityDef:IEntityDef,entity:IEntity):FieldBase<any>[] {

    let fields: FieldBase<any>[] = [];  
    let defProps={};

    if(entity){console.log(`entityDef:${JSON.stringify(entityDef)}\nentity:${JSON.stringify(entity)}`);}
    entityDef.groups.forEach(group=>{
        group.props.forEach(prop=>{
            let order:number= Number(group.order.toString()+prop.order.toString());
            defProps[prop.name]={group:group.name,name:prop.name,type:prop.type,label:prop.label,order:order,required:prop.required};
        });
    });

    for(let key in defProps){
        let field:FieldBase<any>;
        if(entity){
            field= this.contactdb2PropertyType(defProps[key],defProps[key]['group'],entity.props[key]);
            delete entity.props[key];
        }else{
            
            field= this.contactdb2PropertyType(defProps[key],defProps[key]['group']);
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

  fieldsForEntityDefProperty(p:any,groups:Array<any>):FieldBase<any>[]{
      let rtn:FieldBase<any>[]=[];
  
//      TODO:Make a Select Box
      rtn.push(new DropdownField({
              group:p.group,
              key:p.name+"_group",
              value:p.group,
              label:"Group",
              order:1,
              required:true,
              options:groups
              })
              );
      rtn.push(new TextboxField({
          group:p.group,
          key:p.name+"_name",
          value:p.name,
          label:"Name",
          order:2,
          required:true})
      );
      rtn.push(new DropdownField({
          group:p.group,
          key:p.name+"_type",
          value:p.type,
          label:"Type",
          order:3,
          required:true,
          options:[{key:'string',value:'string'},
                   {key:'date',value:'date'},
                   {key:'memo',value:'memo'},
                   {key:'email',value:'email'},
                   {key:'true-false',value:'true-false'},
                   {key:'list',value:'list'}]
      })
      );
      rtn.push(new TextboxField({
          group:p.group,
          key:p.name+"label",
          value:p.label,
          label:"Label",
          order:4})
      );
      rtn.push(new TextboxField({
          group:p.group,
          key:p.name+"_order",
          value:p.order,
          label:"Order",
          order:5})
      );
      rtn.push(new CheckboxField({
          group:p.group,
          key:p.name+"_required",
          value:p.required,
          label:"Required",
          order:6})
      );
  
      return rtn;
  }
}
1