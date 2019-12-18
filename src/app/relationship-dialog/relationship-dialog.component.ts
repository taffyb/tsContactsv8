import { Component, OnInit,Input, Output, EventEmitter, Inject, Optional } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {IEntity,IRelationship} from '../classes/interfaces';
import {BaseRelationship} from'../classes/BaseRelationship';

@Component({
  selector: 'app-relationship-dialog',
  templateUrl: './relationship-dialog.component.html',
  styleUrls: ['../css/dynamic-form-common.css']
})
export class RelationshipDialogComponent implements OnInit {
      relationship:IRelationship=new BaseRelationship();
      source:IEntity;
      target:IEntity;
      labels:string[];
      unsavedChanges:boolean=false;
      formChanged:boolean=false;
      
      constructor(public dialogRef: MatDialogRef<RelationshipDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any
      ) { 
          this.relationship = data.relationship;
          this.source=data.source;
          this.target=data.target;
          this.labels=data.labels;
      }
    
      ngOnInit() {
      }
      onChanged(){
          this.formChanged=true;
          this.unsavedChanges=true;
      }
      onSave() {
          this.unsavedChanges=false;
      }
      
      closeDialog(){ 
          if(this.formChanged){
              this.dialogRef.close({event:'close',data:this.relationship});
          }else{
              this.dialogRef.close({event:'close',data:null});
          }
          
      }
}
