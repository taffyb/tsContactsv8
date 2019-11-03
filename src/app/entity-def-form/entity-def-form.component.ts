import { Component, OnInit,Input, Output, EventEmitter} from '@angular/core';
import { FormGroup }                 from '@angular/forms';

import { FieldBase }              from '../classes/field-base';
import { DataService }    from '../data.service';
import { FieldService } from '../field.service';

import { FieldControlService } from '../field-control.service';
import {IEntityDef} from '../classes/IEntityDef';
import {IProperty} from '../classes/IProperty';
import {BaseProperty} from '../classes/BaseProperty';

@Component({
  selector: 'entity-def-form',
  styleUrls: ['../css/dynamic-form-common.css'],
  templateUrl: './entity-def-form.component.html',
  providers: [ FieldControlService ]
})
export class EntityDefFormComponent implements OnInit {
  propertyFormVisible:boolean=false;
  properties:IProperty[]=[new BaseProperty()];
  @Output()onClose:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()entityDefType:string;
  
  
  display:string;
  fields: FieldBase<any>[] = [];
  fieldGroups:string[];
  title: string="";
  form: FormGroup = new FormGroup({});
  formChanged:boolean=false;
  entityDef:IEntityDef;
  newEntityDefSaved:boolean=false;
  activeTab:string ;
  formHeight:string="300px";
  titleSelected:boolean=false;

  constructor(private fcs: FieldControlService,private fs: FieldService,private ds: DataService) { }

  ngOnInit() {
     // this.properties[0].name = "Notes"
      this.loadEntityDef();
  }

  async loadEntityDef(){
      this.title = this.entityDefType;
      this.entityDef= await this.ds.getEntityDef(this.entityDefType);
//      console.log(`entity-def-form.loadEntityDef(${this.entityDefType})\n${JSON.stringify(this.entityDef)}`);
      this.fieldGroups= await this.ds.getEntityDefGroups(this.entityDefType);
//      console.log(`entity-def-form.loadEntityDef(${this.entityDefType}).fieldGroups\n${JSON.stringify(this.fieldGroups)}`);
      this.display=this.entityDef.display;1
      this.fields = await this.fs.getEntityDefFields(this.entityDef);
//      console.log(`entity-def-form.loadEntityDef(${this.entityDefType}).fields\n${JSON.stringify(this.fields)}`);
      this.form =this.fcs.toFormGroup(this.fields);
      this.activeTab=this.fieldGroups[0];
      this.form.valueChanges.subscribe(form => {
          this.formChanged=true;
      });  
  }

  getFilteredFields(group:string){
      
      let filterByGroup = (element, index, array) =>{      
          return (element.group == group); 
      } 
      let fields:FieldBase<any>[] = this.fields.filter(filterByGroup);
//      console.log(`filtered fields:${group} \n${JSON.stringify(fields)}`);
      return fields;
  }
  addGroup(){
      this.fieldGroups.push('New Group');
  }
  showPropertyForm(){
      this.propertyFormVisible=true;
  }
  hidePropertyForm(){
      this.propertyFormVisible=false;
      this.onClose.emit(true);
  }
  saveProperty(p:IProperty){
      console.log(`${JSON.stringify(p)}`);
      this.propertyFormVisible=false;
  }
  getIcon():string{
      let iconPath:string= `/assets/${this.entityDefType}.svg`;
      return iconPath;
  }
  showProperties(propertyName:string){
      this.propertyFormVisible=true;
  }
}
