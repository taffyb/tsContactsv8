import { Component, Inject, Optional, OnInit } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup }                 from '@angular/forms';

import { FieldBase }              from '../classes/field-base';
import { FieldControlService }    from '../field-control.service';
import { FieldService } from '../field.service';
import { DataService }    from '../data.service';
import {IEntityDef} from '../classes/IEntityDef';
import {IEntity} from '../classes/IEntity';
import {BaseEntity} from '../classes/BaseEntity';

@Component({
  selector: 'entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['../css/dynamic-form-common.css'],
  providers: [ FieldControlService ]
})
export class EntityDialogComponent implements OnInit {
    entity:IEntity;
    fields: FieldBase<any>[] = [];
    activeTab:string="Details";
    form: FormGroup= new FormGroup({});
    formChanged:boolean=false;
    formHeight:string="350px";

    constructor(private fcs: FieldControlService,private fs: FieldService,private ds: DataService,
            public dialogRef: MatDialogRef<EntityDialogComponent>,
            @Optional() @Inject(MAT_DIALOG_DATA) public data: any
            ) {
        if(data){
            if(data.entityDef){
                this.fields = this.fs.getEntityFields(data.entityDef,null);
            }
            if(data.entity){
                this.fields = this.fs.getEntityFields(data.entityDef,data.entity);
            }else{
                this.entity=new BaseEntity();
            }
        }
        this.form =this.fcs.toFormGroup(this.fields);
        this.form.valueChanges.subscribe(form => {
            this.formChanged=true;
        });  
          
    }
    
    ngOnInit() {
    }
    
    onSave() {
      let entity=JSON.parse(JSON.stringify(this.form.value));
      let response;
      if(this.entity.uuid){
          entity["uuid"]=this.entity.uuid;
          entity["type"]=this.entity.type;
          response = this.ds.updateEntity(entity);
      }else{
          entity["type"]=this.entity.type;
          response = this.ds.addEntity(entity);
          this.entity=response;
      }
      this.formChanged = false;
    }
    
    closeDialog(){ 
        this.dialogRef.close({event:'close',data:null}); 
    }

    getFilteredFields(group:string){
        
        let filterByGroup = (element, index, array) =>{      
            return (element.group == group); 
        } 
        let fields:FieldBase<any>[] = this.fields.filter(filterByGroup);
//        console.log(`filtered fields:${group} \n${JSON.stringify(fields)}`);
        return fields;
    }
}
