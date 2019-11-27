import { Component, Inject, Optional, OnInit,Input, Output, EventEmitter } from '@angular/core'; 
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup }                 from '@angular/forms';

import { FieldBase }              from '../classes/field-base';
import { FieldControlService }    from '../field-control.service';
import { FieldService } from '../field.service';
import { DataService }    from '../data.service';
import {IEntityDef, IProperty} from '../classes/interfaces';
import {BaseProperty} from '../classes/BaseProperty';
import { PropertyDialogComponent } from '../property-dialog/property-dialog.component';
import { ModalDialog, DialogOptions } from '../modal-dialog/modal-dialog';

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
    allFields: FieldBase<any>[][] = [];
    fieldGroups:string[];
    title: string="";
    form: FormGroup = new FormGroup({});
    unsavedChanges:boolean=false;
    formChanged:boolean=false;
    newEntityDefSaved:boolean=false;
    activeTab:string ;
    formHeight:string="300px";
    
  constructor(private fcs: FieldControlService,private fs: FieldService,private ds: DataService,
          public dialogRef: MatDialogRef<EntityDefDialogComponent>,
          @Optional() @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog
          ) {
      if(data){
          if(data.entityDef){
              this.allFields = this.fs.getEntityDefFields(data.entityDef);
              this.activeTab=data.fieldGroups[0];
              this.allFields.forEach(fieldSet=>{
                  fieldSet.forEach(field=>{
                      this.fields.push(field);
                  });
              });
          }
      }
      this.form =this.fcs.toFormGroup(this.fields);
//      console.log(`constructor this.fields: ${JSON.stringify(this.fields)}`);
      this.form.valueChanges.subscribe(form => {
          this.formChanged=true;
      }); 
  }

  ngOnInit() {
  }
  
  onSave() {
    this.unsavedChanges = false;
  }
  
  async closeDialog(){ 
      let result:number=DialogOptions.CANCEL;
      
//      console.log(`Close Entity Def Dialog: ${JSON.stringify(this.form.getRawValue())}`);
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
          return (element[0].group == group); 
      } 
      let fields:FieldBase<any>[][] = this.allFields.filter(filterByGroup);
//      console.log(`filtered fields:${group} \n${JSON.stringify(fields)}`);
      return fields;
  }
  openPropertyDialog(){
      let property:IProperty = new BaseProperty();
      const dialogRef = this.dialog.open(PropertyDialogComponent, {
          backdropClass:'custom-dialog-backdrop-class',
          panelClass:'custom-dialog-panel-class',
          data: {property}
        });
     
        dialogRef.afterClosed().subscribe(result => {
//          console.log(`Close Entity Def Dialog: ${JSON.stringify(this.form.getRawValue())}`);
//          console.log(`The dialog was closed ${JSON.stringify(result)}`);
        });
      
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
