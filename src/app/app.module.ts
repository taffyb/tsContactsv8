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
import { PropertyFormComponent } from './property-form/property-form.component';
import { TbContainerComponent } from './tb-container/tb-container.component';
import { ModalDialog } from './modal-dialog/modal-dialog';
import { EntityDialogComponent } from './entity-dialog/entity-dialog.component';
import { EntityDefDialogComponent } from './entity-def-dialog/entity-def-dialog.component';
import { PropertyDialogComponent } from './property-dialog/property-dialog.component';
import { EntityDefFieldComponent } from './entity-def-field/entity-def-field.component';
import { CanvasComponent } from './canvas/canvas.component';
import { EntityUploadDialogComponent } from './entity-upload-dialog/entity-upload-dialog.component';
import { RelationshipDialogComponent } from './relationship-dialog/relationship-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    EntityListComponent,
    EntityDefListComponent,
    DynamicFormFieldComponent,
    PropertyFormComponent,
    TbContainerComponent,
    ModalDialog,
    EntityDialogComponent,
    EntityDefDialogComponent,
    PropertyDialogComponent,
    EntityDefFieldComponent,
    CanvasComponent,
    EntityUploadDialogComponent,
    RelationshipDialogComponent,
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
  entryComponents: [ ModalDialog, 
                     EntityDialogComponent, 
                     EntityDefDialogComponent, 
                     PropertyDialogComponent,
                     EntityUploadDialogComponent]
})
export class AppModule { }
