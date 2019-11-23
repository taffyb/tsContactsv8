import { Component, Inject, Optional, OnInit } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//Import the application components and services.
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-entity-upload-dialog',
  templateUrl: './entity-upload-dialog.component.html',
  styleUrls: ['./entity-upload-dialog.component.css']
})
export class EntityUploadDialogComponent implements OnInit {
    filesSelected=false;
    SERVER_URL = "http://localhost:4001/api/template";
    uploadForm: FormGroup;
    
    constructor(private formBuilder: FormBuilder, private httpClient: HttpClient,
            public dialogRef: MatDialogRef<EntityUploadDialogComponent>,
            @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
        
        dialogRef.disableClose=true;
    }
    ngOnInit() {
        this.uploadForm = this.formBuilder.group({
            profile: ['']
          });
    }
    onFileSelect(event) {
      if (event.target.files.length > 0) {
        this.filesSelected=true;
        const file = event.target.files[0];
        this.uploadForm.get('profile').setValue(file);
      }else{
          this.filesSelected=false;
      }
    }
    onSubmit() {
      console.log(`onSubmit`);
        
      const formData = new FormData();
      formData.append('file', this.uploadForm.get('profile').value);

      this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
        (res) => {
                console.log(res);
                this.dialogRef.close({event:'close',data:"submit"});
            },
        (err) => {
            console.log(err);
            this.dialogRef.close({event:'close',data:"submit"});}
      );
      
      
    }
    
  closeDialog(){ 
      this.dialogRef.close({event:'close',data:null});
  }
}
