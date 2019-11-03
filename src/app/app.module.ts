import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModules } from './material-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityDefListComponent } from './entity-def-list/entity-def-list.component';
import { DynamicFormFieldComponent } from './dynamic-form-field/dynamic-form-field.component';
import { EntityDefFormComponent } from './entity-def-form/entity-def-form.component';
import { EntityFormComponent } from './entity-form/entity-form.component';
import { PropertyFormComponent } from './property-form/property-form.component';
import { TbContainerComponent } from './tb-container/tb-container.component';
import { ModalDialog } from './modal-dialog/modal-dialog';

@NgModule({
  declarations: [
    AppComponent,
    EntityListComponent,
    EntityDefListComponent,
    DynamicFormFieldComponent,
    EntityDefFormComponent,
    EntityFormComponent,
    PropertyFormComponent,
    TbContainerComponent,
    ModalDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    MaterialModules
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ ModalDialog, ]
})
export class AppModule { }
