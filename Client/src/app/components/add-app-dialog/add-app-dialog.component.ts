import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  message: string;
  editData: any;
  withCode: boolean;
}

@Component({
  selector: 'app-add-app-dialog',
  templateUrl: './add-app-dialog.component.html',
  styleUrls: ['./add-app-dialog.component.css']
})
export class AddAppDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddAppDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }
  withCode: boolean;
  formGroup: FormGroup;
  ngOnInit(): void {
    this.createForm();
    this.withCode = this.data.withCode;
  }

  createForm() {
    let app = this.data.editData
    if(app){
      this.formGroup = this.formBuilder.group({
        'name': [app.name, [Validators.required]],
        'code': [app.code, [Validators.required]],
        'description': [app.description, [Validators.required]]
      });
    }
    else{
      this.formGroup = this.formBuilder.group({
        'name': [null, [Validators.required]],
        'code': [null, []],
        'description': [null, [Validators.required]]
      });
    }
  }


  onClickNO(){
    this.dialogRef.close();
  }

  submitForm(){
    let res = this.formGroup.value;
    this.dialogRef.close(res);
  }
}
