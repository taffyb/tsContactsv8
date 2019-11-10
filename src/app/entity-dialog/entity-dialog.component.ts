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
import { MatDialog } from '@angular/material';
import { ModalDialog, DialogOptions } from '../modal-dialog/modal-dialog';

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
    unsavedChanges:boolean=false;
    formChanged:boolean=false;
    formHeight:string="350px";
    do=DialogOptions;

    constructor(private fcs: FieldControlService,private fs: FieldService,
            public dialog: MatDialog,
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
            this.unsavedChanges=true;
        });  
          
    }
    
    ngOnInit() {
    }
    
    onSave() {
      this.unsavedChanges = false;
    }
    
    async closeDialog(){ 
        let result:number=DialogOptions.CANCEL;
        
        if(this.unsavedChanges){
            result = await this.openDialog();
            if(result == DialogOptions.OK){
                this.dialogRef.close({event:'close',data:null}); 
            }  
        }else{
            if(this.formChanged){
                this.dialogRef.close({event:'close',data:this.form.getRawValue()});
            }else{
                this.dialogRef.close({event:'close',data:null});
            }
        }
    }

    getFilteredFields(group:string){
        
        let filterByGroup = (element, index, array) =>{      
            return (element.group == group); 
        } 
        let fields:FieldBase<any>[] = this.fields.filter(filterByGroup);
//        console.log(`filtered fields:${group} \n${JSON.stringify(fields)}`);
        return fields;
    }

    openDialog(): Promise<number> {
        return new Promise(async (resolve,reject)=>{
            const dialogRef = this.dialog.open(ModalDialog, {
                width: '300px',
                backdropClass:'custom-dialog-backdrop-class',
                panelClass:'custom-dialog-panel-class',
                data: {message: "Are you have unsaved changes.\nAre you sure you want to Exit?",
                       dialogOptions:DialogOptions.QUESTION+DialogOptions.OK+DialogOptions.CANCEL+DialogOptions.MANDATORY
                      }
              });
             let result= await dialogRef.afterClosed().toPromise();
             resolve(result.data);
        });
        
      }
}
