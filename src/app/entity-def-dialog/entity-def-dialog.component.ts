import { Component, Inject, Optional, OnInit } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup }                 from '@angular/forms';

import { FieldBase }              from '../classes/field-base';
import { FieldControlService }    from '../field-control.service';
import { FieldService } from '../field.service';
import { DataService }    from '../data.service';
import {IEntityDef} from '../classes/IEntityDef';

@Component({
  selector: 'app-entity-def-dialog',
  templateUrl: './entity-def-dialog.component.html',
  styleUrls: ['../css/dynamic-form-common.css'],
  providers: [ FieldControlService ]
})
export class EntityDefDialogComponent implements OnInit {

  constructor(private fcs: FieldControlService,private fs: FieldService,private ds: DataService,
          public dialogRef: MatDialogRef<EntityDefDialogComponent>,
          @Optional() @Inject(MAT_DIALOG_DATA) public data: any
          ) {}

  ngOnInit() {
  }

}
