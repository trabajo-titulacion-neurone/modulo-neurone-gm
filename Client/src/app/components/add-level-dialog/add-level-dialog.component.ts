import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  message: string;
  editData: any;
  points: [];
  withCode: boolean;
}

@Component({
  selector: 'app-add-level-dialog',
  templateUrl: './add-level-dialog.component.html',
  styleUrls: ['./add-level-dialog.component.css']
})
export class AddLevelDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddLevelDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }

  formGroup: FormGroup;
  file: File;
  withCode: boolean;
  ngOnInit(): void {
    this.withCode = this.data.withCode;
    this.createForm();
  }

  createForm() {
    let level = this.data.editData;
    if(level){
      this.formGroup = this.formBuilder.group({
        'name': [level.name, [Validators.required]],
        'code': [level.code, [Validators.required]],
        'description': [level.description, [Validators.required]],
        'point_required': [level.point_required.code, [Validators.required]],
        'point_threshold': [level.point_threshold, [Validators.required]]
      });
    }
    else{
      this.formGroup = this.formBuilder.group({
        'name': [null, [Validators.required]],
        'code': [null, []],
        'description': [null, [Validators.required]],
        'point_required': [null, [Validators.required]],
        'point_threshold': [null, [Validators.required]]
      });
    }
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  submitForm(){
    let res = this.formGroup.value;
    res.file = this.file;
    this.dialogRef.close(res);
  }

  onClickNO(){
    this.dialogRef.close();
  }

}
