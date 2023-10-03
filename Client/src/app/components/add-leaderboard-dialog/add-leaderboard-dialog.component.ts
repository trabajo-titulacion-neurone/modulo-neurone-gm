import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {EndpointsService} from '../../endpoints/endpoints.service';

export interface DialogData {
  message: string;
  editData: any;
  withCode: boolean;
  appCode: string;
}

@Component({
  selector: 'app-add-leaderboard-dialog',
  templateUrl: './add-leaderboard-dialog.component.html',
  styleUrls: ['./add-leaderboard-dialog.component.css']
})
export class AddLeaderboardDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddLeaderboardDialogComponent>, public translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData, public formBuilder: FormBuilder,
              protected endpointsService: EndpointsService) {}

  firstFormGroup: FormGroup;
  types = [];
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  type: {id, name} = {id: '', name: ''};
  points = [];
  actions = [];
  selectedElement: any;
  ngOnInit(): void {
    this.translate.get('actions').subscribe(res => {
      this.types.push({id: 'actions', name: res});
    });
    this.translate.get('points').subscribe(res => {
      this.types.push({id: 'points', name: res});
    });
    this.getActions();
    this.getPoints();
    this.createForms();
  }

  createForms() {
    let leaderboard = this.data.editData;
    this.secondFormGroup = this.formBuilder.group({
      element_code: [null, Validators.required]
    });
    if(leaderboard){
      if(leaderboard.parameter === 'actions'){
        this.firstFormGroup = this.formBuilder.group({
          parameter: [this.types[0], Validators.required]
        });
      }
      else{
        this.firstFormGroup = this.formBuilder.group({
          parameter: [this.types[1], Validators.required]
        });
      }
      this.thirdFormGroup = this.formBuilder.group({
        'name': [leaderboard.name, [Validators.required]],
        'code': [leaderboard.code, [Validators.required]],
      });
    }
    else{
      this.firstFormGroup = this.formBuilder.group({
        parameter: [this.types[0], Validators.required]
      });
      this.thirdFormGroup = this.formBuilder.group({
        'name': [null, [Validators.required]],
        'code': [null, []],
      });
    }
  }

  getActions(){
    this.endpointsService.getActions(this.data.appCode).subscribe((data: {
        actions: any[]; ok: boolean} ) => { // Success
        this.actions = data.actions;
      },
      (error) => {
        console.error(error);
      });
  }
  getPoints(){
    this.endpointsService.getPoints(this.data.appCode).subscribe((data: {
        data: any[]; ok: boolean} ) => { // Success
        this.points = data.data;
      },
      (error) => {
        console.error(error);
      });
  }
  onClickNO(){
    this.dialogRef.close();
  }

  onChangeType($event){
    this.type = $event.value;
    this.secondFormGroup.controls['element_code'].setValue(null);
  }

  onSubmit(){
    let res = this.thirdFormGroup.value;
    res.parameter = this.firstFormGroup.value.parameter.id;
    res.element_code = this.secondFormGroup.value.element_code.code;
    this.dialogRef.close(res);
  }

}
