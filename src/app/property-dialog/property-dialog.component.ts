import { Component, Inject, Optional, OnInit,Input, Output, EventEmitter } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {IProperty} from '../classes/interfaces';
import { FormGroup } from '@angular/forms';

import { FieldControlService } from '../field-control.service';

import { DropdownField } from '../classes/field-dropdown';
import { FieldBase }     from '../classes/field-base';
import { TextboxField }  from '../classes/field-textbox';
import { CheckboxField }  from '../classes/field-checkbox';
import { TextareaField }  from '../classes/field-textarea';
import { HLineField }  from '../classes/field-hr';

@Component({
  selector: 'property-dialog',
  templateUrl: './property-dialog.component.html',
  styleUrls: ['../css/dynamic-form-common.css']
})
export class PropertyDialogComponent implements OnInit {
    @Output()onSave:EventEmitter<IProperty> = new EventEmitter<IProperty>();
    @Output()onClose:EventEmitter<boolean> = new EventEmitter<boolean>();
    
    form: FormGroup;
    formChanged:boolean;
    fields: FieldBase<any>[] = [];

  constructor(private fcs: FieldControlService,
          public dialogRef: MatDialogRef<PropertyDialogComponent>,
          @Optional() @Inject(MAT_DIALOG_DATA) public data: any
          ) {
      this.fields=this.getFields(data.property);
      this.form = this.fcs.toFormGroup(this.fields);
      this.form.valueChanges.subscribe(form => {
          this.formChanged=true;
      });     }

  ngOnInit() {
  }
  private getFields(p:IProperty):FieldBase<any>[]{
          let fields:FieldBase<any>[]=[];
          let field:FieldBase<any>;
      
//          console.log(`${JSON.stringify(p)}`);
          field=new TextboxField({
              key:'name',
              value:p.name,
              label:'Name:',
              order:1,
              required:true});
          fields.push(field);
          
          field=new DropdownField({
              key:'type',
              value:p.type,
              label:'Type:',
              order:2,
              required:true,
              options: [
                    {key: 'string',  value: 'string'},
                    {key: 'date',  value: 'date'},
                    {key: 'email',   value: 'email'},
                    {key: 'memo', value: 'memo'},
                    {key: 'list', value: 'list'},
                    {key: 'true-false', value: 'true-false'}
              ]});
          fields.push(field);
          
          field=new TextboxField({
              key:'label',
              value:p.label,
              label:'Label:',
              order:3});
          fields.push(field);
          
          field=new CheckboxField({
              key:'required',
              value:p.required,
              label:'Required:',
              order:4});
          fields.push(field);

//          console.log(`${JSON.stringify(fields)}`);
          return fields;
      }
}
