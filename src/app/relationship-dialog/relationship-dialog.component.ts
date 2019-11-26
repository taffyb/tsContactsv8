import { Component, OnInit,Input, Output, EventEmitter, Inject, Optional } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {IRelationship} from '../classes/IRelationship';

@Component({
  selector: 'app-relationship-dialog',
  templateUrl: './relationship-dialog.component.html',
  styleUrls: ['./relationship-dialog.component.css']
})
export class RelationshipDialogComponent implements OnInit {
  @Input()relationship:IRelationship;
  @Input()labels:string[];

  constructor(public dialogRef: MatDialogRef<RelationshipDialogComponent>,
          @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

}
