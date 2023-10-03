import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

export interface DialogData {
  message: string;
  editData: any;
  withCode: boolean;
}

@Component({
  selector: 'app-add-action-dialog',
  templateUrl: './add-action-dialog.component.html',
  styleUrls: ['./add-action-dialog.component.css']
})
export class AddActionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddActionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }
  file: File;
  formGroup: FormGroup;
  repeatable = [true, false]
  withCode: boolean;
  ngOnInit(): void {
    this.withCode = this.data.withCode;
    this.createForm();
  }

  createForm() {
    let action = this.data.editData
    if(action){
      this.formGroup = this.formBuilder.group({
        'name': [action.name, [Validators.required]],
        'code': [action.code, [Validators.required]],
        'description': [action.description, [Validators.required]],
        'repeatable': [action.repeatable, [Validators.required]]
      });
    }
    else{
      this.formGroup = this.formBuilder.group({
        'name': [null, [Validators.required]],
        'code': [null, []],
        'description': [null, [Validators.required]],
        'repeatable': [null, [Validators.required]]
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
