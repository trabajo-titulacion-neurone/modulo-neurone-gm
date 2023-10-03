import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';


export interface DialogData {
  message: string;
  editData: any;
  withCode: boolean;
}

@Component({
  selector: 'app-add-point-dialog',
  templateUrl: './add-point-dialog.component.html',
  styleUrls: ['./add-point-dialog.component.css']
})
export class AddPointDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddPointDialogComponent>, public translate: TranslateService, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }
  formGroup: FormGroup;
  file: File;
  dailyMaxTip: String;
  maxPointsTip: String;
  defaultTip: String;
  hiddenTip: String;
  initialPointsTip: String;
  hidden = [true, false]
  default = [true, false]
  withCode: boolean;
  ngOnInit(): void {
    this.withCode = this.data.withCode;
    this.createForm();
    this.translate.get('point.initialPointsTip').subscribe(res => {
      this.initialPointsTip = res;
    });
    this.translate.get('point.dailyMaxTip').subscribe(res => {
      this.dailyMaxTip = res;
    });
    this.translate.get('point.maxPointsTip').subscribe(res => {
      this.maxPointsTip = res;
    });
    this.translate.get('point.hiddenTip').subscribe(res => {
      this.hiddenTip = res;
    });
    this.translate.get('point.defaultTip').subscribe(res => {
      this.defaultTip = res;
    });
  }

  createForm() {
    let point = this.data.editData
    if(point){
      this.formGroup = this.formBuilder.group({
        'name': [point.name, [Validators.required]],
        'code': [point.code, [Validators.required]],
        'abbreviation': [point.abbreviation, [Validators.required]],
        'initial_points': [point.initial_points, [Validators.required]],
        'max_points': [point.max_points, [Validators.required]],
        'daily_max': [point.daily_max, [Validators.required]],
        'is_default': [point.is_default, [Validators.required]],
        'hidden': [point.hidden, [Validators.required]],
      });
    }
    else{
      this.formGroup = this.formBuilder.group({
        'name': [null, [Validators.required]],
        'code': [null, []],
        'abbreviation': [null, [Validators.required]],
        'initial_points': [null, [Validators.required]],
        'max_points': [null, [Validators.required]],
        'daily_max': [null, [Validators.required]],
        'is_default': [null, [Validators.required]],
        'hidden': [null, [Validators.required]],
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
