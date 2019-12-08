import { Component, OnInit,Input, Output, EventEmitter, Inject, Optional } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {IRelationship} from '../classes/interfaces';
import {BaseRelationship} from'../classes/BaseRelationship';

@Component({
  selector: 'app-relationship-dialog',
  templateUrl: './relationship-dialog.component.html',
  styleUrls: ['../css/dynamic-form-common.css']
})
export class RelationshipDialogComponent implements OnInit {
  relationship:IRelationship=new BaseRelationship();
  labels:string[];

  constructor(public dialogRef: MatDialogRef<RelationshipDialogComponent>,
          @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
      this.relationship = data.relationship;
      this.labels=data.labels;
      console.log(`Relationship: ${JSON.stringify(this.relationship)}\n${JSON.stringify(this.labels)}`);
  }

  ngOnInit() {
  }
  
  onSave() {
  }
  
  closeDialog(){ 

      console.log(`onClose Relationship: ${JSON.stringify(this.relationship)}`);
      this.dialogRef.close({event:'close',data:null});
  }
}
