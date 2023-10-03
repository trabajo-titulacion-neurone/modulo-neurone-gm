import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

export interface DialogData {
  message: string;
  editData: any;
  withCode: boolean;
}

@Component({
  selector: 'app-add-player-dialog',
  templateUrl: './add-player-dialog.component.html',
  styleUrls: ['./add-player-dialog.component.css']
})
export class AddPlayerDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddPlayerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }
  file: File;
  formGroup: FormGroup;
  withCode: boolean;
  ngOnInit(): void {
    this.withCode = this.data.withCode;
    this.createForm();
  }

  createForm() {
    let player = this.data.editData
    if(player){
      this.formGroup = this.formBuilder.group({
        'name': [player.name, [Validators.required]],
        'last_name': [player.last_name, [Validators.required]],
        'code': [player.last_name, [Validators.required]],
        'sourceId': [player.sourceId, []]
      });
    }
    else{
      this.formGroup = this.formBuilder.group({
        'name': [null, [Validators.required]],
        'last_name': [null, [Validators.required]],
        'code': [null, []],
        'sourceId': [null, []]
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
