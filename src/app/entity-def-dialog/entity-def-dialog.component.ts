import { Component, Inject, Optional, OnInit,Input, Output, EventEmitter } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup }                 from '@angular/forms';

import { FieldBase }              from '../classes/field-base';
import { FieldControlService }    from '../field-control.service';
import { FieldService } from '../field.service';
import { DataService }    from '../data.service';
import {IEntityDef} from '../classes/IEntityDef';
import {IProperty} from '../classes/IProperty';
import {BaseProperty} from '../classes/BaseProperty';

@Component({
  selector: 'app-entity-def-dialog',
  templateUrl: './entity-def-dialog.component.html',
  styleUrls: ['../css/dynamic-form-common.css'],
  providers: [ FieldControlService ]
})
export class EntityDefDialogComponent implements OnInit {

    properties:IProperty[]=[new BaseProperty()];
    @Output()onClose:EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input()entityDef:IEntityDef;
    
    
    display:string;
    fields: FieldBase<any>[] = [];
    fieldGroups:string[];
    title: string="";
    form: FormGroup = new FormGroup({});
    formChanged:boolean=false;
    newEntityDefSaved:boolean=false;
    activeTab:string ;
    formHeight:string="300px";
    
  constructor(private fcs: FieldControlService,private fs: FieldService,private ds: DataService,
          public dialogRef: MatDialogRef<EntityDefDialogComponent>,
          @Optional() @Inject(MAT_DIALOG_DATA) public data: any
          ) {
      if(data){
          if(data.entityDef){
              this.fields = this.fs.getEntityDefFields(data.entityDef);
              this.activeTab=data.fieldGroups[0];
          }
      }
      this.form =this.fcs.toFormGroup(this.fields);
      this.form.valueChanges.subscribe(form => {
          this.formChanged=true;
      }); 
  }

  ngOnInit() {
  }
  
  closeDialog(){ 
      this.dialogRef.close({event:'close',data:null}); 
  }

  getFilteredFields(group:string){
      
      let filterByGroup = (element, index, array) =>{      
          return (element.group == group); 
      } 
      let fields:FieldBase<any>[] = this.fields.filter(filterByGroup);
      console.log(`filtered fields:${group} \n${JSON.stringify(fields)}`);
      return fields;
  }
}
