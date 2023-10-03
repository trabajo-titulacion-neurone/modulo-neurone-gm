import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddLeaderboardDialogComponent} from '../../components/add-leaderboard-dialog/add-leaderboard-dialog.component';
import {EndpointsService} from '../../endpoints/endpoints.service';
import {MatTableDataSource} from "@angular/material/table";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-design-leaderboards',
  templateUrl: './design-leaderboards.component.html',
  styleUrls: ['./design-leaderboards.component.css']
})
export class DesignLeaderboardsComponent implements OnInit {

  constructor(public dialog: MatDialog, protected endpointsService: EndpointsService, public translate: TranslateService, private toastr: ToastrService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource= new MatTableDataSource();
  leaderboards = [];
  itemsPerPage: string;
  displayedColumns: string[] = ['name'];
  load = true;
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
        this.getLeaderboards();
      },
      (error) => {
        console.error(error);
      });
  }
  getLeaderboards(){
    this.endpointsService.getLeaderboards(this.focusApp.code).subscribe((data: {
        data: any[]; ok: boolean} ) => { // Success
        this.leaderboards = data.data;
        this.dataSource.data = this.leaderboards;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = this.itemsPerPage;
        this.load = false;
      },
      (error) => {
        console.error(error);
      });
  }
  openAddLeaderboardDialog() {
    let message, successMessage;
    this.translate.get('leaderboard.addLeaderboardTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('leaderboard.addSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddLeaderboardDialogComponent, {
      data: {message, withCode: false, appCode: this.focusApp.code},
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.endpointsService.postLeaderboards(res, this.focusApp.code).subscribe((data: {
            data: any[]; ok: boolean} ) => { // Success
              if(data.ok){
                this.toastr.success(successMessage, null, {
                  timeOut: 10000,
                  positionClass: 'toast-center-center'
                });
                this.getLeaderboards();
              }
          },
          (error) => {
            this.toastr.error(error, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
          });
      }
    });
  }

  openEditLeaderboardDialog() {
    let message, successMessage;
    this.translate.get('leaderboard.editLeaderboardTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('leaderboard.editSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddLeaderboardDialogComponent, {
      data: {
        message,
        editData: this.selectedRow,
        withCode: true,
        appCode: this.focusApp.code
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.endpointsService.putLeaderboard(res, this.focusApp.code, this.selectedRow.code).subscribe((data: { data: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.info(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getLeaderboards();
            this.selectedRow = null;
          }
        }, (error) => {
          this.toastr.error(error, null, {
            timeOut: 10000,
            positionClass: 'toast-center-center'
          });
        });
      }
    });
  }

  deleteLeaderboard(){
    let successMessage, confirmMessage;
    this.translate.get('leaderboard.deleteSuccess').subscribe(res => {
      successMessage = res;
    });
    this.translate.get('leaderboard.deleteConfirm').subscribe(res => {
      confirmMessage = res;
    });
    if(confirm(confirmMessage)){
      this.endpointsService.deleteLeaderboard(this.focusApp.code, this.selectedRow.code).subscribe( () => {
        this.toastr.error(successMessage, null, {
          timeOut: 10000,
          positionClass: 'toast-center-center'
        });
        this.getLeaderboards();
        this.selectedRow = null;
      },  (error) => {
        this.toastr.error(error, null, {
          timeOut: 10000,
          positionClass: 'toast-center-center'
        });
      });
    }
  }

}
