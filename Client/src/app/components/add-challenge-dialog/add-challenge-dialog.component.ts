import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DialogData {
  message: string;
  actions: [];
  points: [];
  challenge: any;
  challenges: [];
  badges: [];
  withCode: boolean;
}

@Component({
  selector: 'app-add-challenge-dialog',
  templateUrl: './add-challenge-dialog.component.html',
  styleUrls: ['./add-challenge-dialog.component.css']
})
export class AddChallengeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddChallengeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder) { }
  actions_required: {action_code: string, times_required: number, action_name: string}[] = [];
  challenges_required: {challenge_code: string, challenge_name: string}[] = [];
  points_awards: {point_code: string, amount: number, point_name: string}[] = [];
  usedActions = [];
  usedChallenges = [];
  usedPoints = [];
  actions = new Array();
  challenges = new Array();
  points = new Array();
  badges = [];
  newAction: any;
  newChallenge: any;
  newPoint: any;
  newPointAmount: number;
  newAmount: number;
  withCode: boolean;
  formGroup: FormGroup;
  ngOnInit(): void {
    this.withCode = this.data.withCode;
    this.createForm();
    this.actions = Object.create(this.data.actions);
    this.challenges = Object.create(this.data.challenges);
    this.points = Object.create(this.data.points);
    this.badges = this.data.badges;
    let challenge = this.data.challenge;
    //Se llena el formulario de edición con los datos provenientes del desafío que se quiere editar
    if(challenge){
      let index;
      //se saca de las opciones de requisito de challenge al propio challenge
      for(let i = 0; i<this.challenges.length; i++){
        if(this.challenges[i].code === challenge.code){
          index = i;
          break;
        }
      }
      this.challenges.splice(index, 1);
      //En este for se cargan las acciones que tiene el desafío que se quiere editar
      for(let i = 0; i<challenge.actions_required.length; i++){
        this.actions_required.push({
          action_code: challenge.actions_required[i].action.code,
          times_required: challenge.actions_required[i].times_required,
          action_name: challenge.actions_required[i].action.name});
        this.usedActions.push(this.data.challenge.actions_required[i].action);
        //Dentro de las acciones elegibles para utilizar en el desafío, se quitan las que ya provenían del desafío que se está editando
        for(let j = 0 ; j<this.actions.length; j++){
          if(this.actions[j].code === challenge.actions_required[i].action.code){
            index = j;
            break;
          }
        }
        this.actions.splice(index, 1);
      }
      //En este for se cargan los desafíos requeridos que tiene el desafío que se quiere editar
      for(let i = 0; i<this.data.challenge.challenges_required.length; i++){
        this.challenges_required.push({
          challenge_code: challenge.challenges_required[i].challenge.code,
          challenge_name: challenge.challenges_required[i].challenge.name});
        this.usedChallenges.push(challenge.challenges_required[i].challenge);
        //Dentro de los desafíos elegibles para utilizar en el desafío, se quitan las que ya provenían del desafío que se está editando
        for(let j = 0 ; j<this.challenges.length; j++){
          if(this.challenges[j].code === challenge.challenges_required[i].challenge.code){
            index = j;
            break;
          }
        }
        this.challenges.splice(index, 1);
      }
      //En este for se cargan los puntos de recompensa que tiene el desafío que se quiere editar
      for(let i = 0; i<challenge.points_awards.length; i++){
        this.points_awards.push({
          point_code: challenge.points_awards[i].point.code,
          point_name: challenge.points_awards[i].point.name,
          amount: challenge.points_awards[i].amount
        });
        this.usedPoints.push(challenge.points_awards[i].point);
        //Dentro de los puntos elegibles para utilizar en el desafío, se quitan las que ya provenían del desafío que se está editando
        for(let j = 0 ; j<this.points.length; j++){
          if(this.points[j].code === challenge.points_awards[i].point.code){
            index = j;
            break;
          }
        }
        this.points.splice(index, 1);
      }
    }
  }
  onClickNO(){
    this.dialogRef.close();
  }
  createForm() {
    let challenge = this.data.challenge;
    if(challenge){
      this.formGroup = this.formBuilder.group({
        'name': [challenge.name, [Validators.required]],
        'code': [challenge.code, [Validators.required]],
        'description': [challenge.description, [Validators.required]],
        'start_date': [challenge.start_date, [Validators.required]],
        'end_date': [challenge.end_date, [Validators.required]],
        'badge_award': [null, []]
      });
    }
    else{
      this.formGroup = this.formBuilder.group({
        'name': [null, [Validators.required]],
        'code': [null, []],
        'description': [null, [Validators.required]],
        'start_date': [null, [Validators.required]],
        'end_date': [null, [Validators.required]],
        'badge_award': [null, []]
      });
    }
  }
  submitForm(){
    let res = this.formGroup.value;
    res.actions_required = this.actions_required;
    res.challenges_required = this.challenges_required;
    res.points_awards = this.points_awards;
    this.dialogRef.close(res);
  }
  onclickAddAction(){
    this.actions_required.push({action_code: this.newAction.code, times_required: this.newAmount, action_name: this.newAction.name});
    this.usedActions.push(this.newAction);
    const index = this.actions.indexOf(this.newAction);
    this.actions.splice(index, 1);
    this.newAmount = null;
    this.newAction = null;
  }
  onclickAddAChallenge(){
    this.challenges_required.push({challenge_code: this.newChallenge.code, challenge_name: this.newChallenge.name});
    this.usedChallenges.push(this.newChallenge);
    const index = this.challenges.indexOf(this.newChallenge);
    this.challenges.splice(index, 1);
    this.newChallenge = null;
  }
  onclickAddPoint(){
    this.points_awards.push({point_code: this.newPoint.code, amount: this.newPointAmount, point_name: this.newPoint.name});
    this.usedPoints.push(this.newPoint);
    const index = this.points.indexOf(this.newPoint);
    this.points.splice(index, 1);
    this.newPointAmount = null;
    this.newPoint = null;
  }
  takeOutAction(action){
    const index = this.actions_required.indexOf(action);
    let index2 = 0;
    for (let i = 0; i < this.usedActions.length; i++){
      if (this.usedActions[i].code === action.action_code){
        index2 = i;
      }
    }
    this.actions.push(this.usedActions[index2]);
    this.usedActions.splice(index2, 1);
    this.actions_required.splice(index, 1);
  }
  takeOutChallenge(challenge){
    const index = this.challenges_required.indexOf(challenge);
    let index2 = 0;
    for (let i = 0; i < this.usedChallenges.length; i++){
      if (this.usedChallenges[i].code === challenge.challenge_code){
        index2 = i;
      }
    }
    this.challenges.push(this.usedChallenges[index2]);
    this.usedChallenges.splice(index2, 1);
    this.challenges_required.splice(index, 1);
  }
  takeOutPoint(point){
    const index = this.points_awards.indexOf(point);
    let index2 = 0;
    for (let i = 0; i < this.usedPoints.length; i++){
      if (this.usedPoints[i].code === point.point_code){
        index2 = i;
      }
    }
    this.points.push(this.usedPoints[index2]);
    this.usedPoints.splice(index2, 1);
    this.points_awards.splice(index, 1);
  }
}
