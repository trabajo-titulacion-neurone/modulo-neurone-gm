import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

export interface DialogData {
  message: string;
  editData: any;
  withCode: boolean;
}

@Component({
  selector: 'app-add-badge-dialog',
  templateUrl: './add-badge-dialog.component.html',
  styleUrls: ['./add-badge-dialog.component.css']
})
export class AddBadgeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddBadgeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }
  formGroup: FormGroup;
  withCode: boolean;
  file: File;
  ngOnInit(): void {
    this.withCode = this.data.withCode;
    this.createForm();
  }

  createForm() {
    let badge = this.data.editData
    if(badge){
      this.formGroup = this.formBuilder.group({
        'title': [badge.title, [Validators.required]],
        'code': [badge.code, [Validators.required]],
        'description': [badge.description, [Validators.required]],
        'file': [null, []]
      });
    }
    else{
      this.formGroup = this.formBuilder.group({
        'title': [null, [Validators.required]],
        'code': [null, []],
        'description': [null, [Validators.required]],
        'file': [null, [Validators.required]],
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
