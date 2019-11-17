import { Component, Input,OnInit } from '@angular/core';
import { FormGroup }        from '@angular/forms';

import { FieldBase }     from '../classes/field-base';
import { IProperty }     from '../classes/IProperty';

@Component({
  selector: 'entity-def-field',
  templateUrl: './entity-def-field.component.html',
  styleUrls: ['./entity-def-field.component.css']
})
export class EntityDefFieldComponent implements OnInit {
    @Input() field: FieldBase<any>;
    @Input() form: FormGroup;
    get isValid() { return this.form.controls[this.field.key].valid; }
    
    edit:boolean=false;

    name: string;
    type: string;
    label: string;
    required: boolean;
    order: number;

    constructor() { }

    ngOnInit() {
    }
    toggleEdit(){
        this.edit = !this.edit;
    }
}
