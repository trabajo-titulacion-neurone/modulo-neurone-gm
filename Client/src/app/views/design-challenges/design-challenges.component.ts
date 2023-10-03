import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {EndpointsService} from '../../endpoints/endpoints.service';
import {MatDialog} from '@angular/material/dialog';
import {AddChallengeDialogComponent} from '../../components/add-challenge-dialog/add-challenge-dialog.component';
import {TranslateService} from "@ngx-translate/core";
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-design-challenges',
  templateUrl: './design-challenges.component.html',
  styleUrls: ['./design-challenges.component.css']
})
export class DesignChallengesComponent implements OnInit {

  constructor(protected endpointsService: EndpointsService, public dialog: MatDialog, public translate: TranslateService, private toastr: ToastrService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource= new MatTableDataSource();
  challenges = [];
  itemsPerPage: string;
  actions = [];
  points = [];
  badges = [];
  load = true;
  displayedColumns: string[] = ['name'];
  selectedRow = null;
  focusApp: any = {};
  ngOnInit(): void {
    this.getActiveApp();
    this.translate.get('itemsPerPage').subscribe(res => {
      this.itemsPerPage  = res;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  select(row){
    this.selectedRow = row;
  }
  getActiveApp(){
    this.endpointsService.getActiveApp().subscribe((data: {data: object, ok: boolean}) => { // Success
        this.focusApp = data.data;
        this.getChallenges();
        this.getActions();
        this.getPoints();
        this.getBadges();
      },
      (error) => {
        console.error(error);
      });
  }
  getChallenges(){
    this.endpointsService.getChallenges(this.focusApp.code).subscribe((data: {
        data: any[]; ok: boolean} ) => { // Success
        this.challenges = data.data;
        for(let i = 0; i<this.challenges.length; i++){
          this.challenges[i].start_display = new Date(this.challenges[i].start_date).toLocaleDateString();
          this.challenges[i].end_display = new Date(this.challenges[i].end_date).toLocaleDateString();
        }
        this.dataSource.data = this.challenges;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = this.itemsPerPage;
        this.load = false;
      },
      (error) => {
        console.error(error);
      });
  }
  getActions(){
    this.endpointsService.getActions(this.focusApp.code).subscribe((data: {
        actions: any[]; ok: boolean} ) => { // Success
        this.actions = data.actions;
      },
      (error) => {
        console.error(error);
      });
  }
  getPoints(){
    this.endpointsService.getPoints(this.focusApp.code).subscribe((data: {
        data: any[]; ok: boolean} ) => { // Success
        this.points = data.data;
      },
      (error) => {
        console.error(error);
      });
  }
  getBadges(){
    this.endpointsService.getBadges(this.focusApp.code).subscribe((data: {
        badges: any[]; ok: boolean} ) => { // Success
        this.badges = data.badges;
      },
      (error) => {
        console.error(error);
      });
  }
  openAddAChallengeDialog() {
    let message, successMessage;
    this.translate.get('challenge.addChallengeTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('challenge.addSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddChallengeDialogComponent, {
      data: {
        message: message,
        actions: this.actions,
        points: this.points,
        challenges: this.challenges,
        badges: this.badges,
        withCode: false
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.endpointsService.postChallenge(res, this.focusApp.code).subscribe((data: { data: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.success(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getChallenges();
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  openEditChallengeDialog() {
    let message, successMessage;
    this.translate.get('challenge.editChallengeTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('challenge.editSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddChallengeDialogComponent, {
      data: {
        message,
        challenge: this.selectedRow,
        actions: this.actions,
        points: this.points,
        badges: this.badges,
        challenges: this.challenges,
        withCode: true
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.endpointsService.putChallenge(res, this.focusApp.code, this.selectedRow.code).subscribe((data: { data: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.info(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getChallenges();
            this.selectedRow = null;
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  deleteChallenge(){
    let successMessage, confirmMessage;
    this.translate.get('challenge.deleteSuccess').subscribe(res => {
      successMessage = res;
    });
    this.translate.get('challenge.deleteConfirm').subscribe(res => {
      confirmMessage = res;
    });
    if(confirm(confirmMessage)){
      this.endpointsService.deleteChallenge(this.focusApp.code, this.selectedRow.code).subscribe( () => {
        this.toastr.error(successMessage, null, {
          timeOut: 10000,
          positionClass: 'toast-center-center'
        });
        this.getChallenges();
        this.selectedRow = null;
      },  (error) => {
        console.error(error);
      });
    }
  }
}
