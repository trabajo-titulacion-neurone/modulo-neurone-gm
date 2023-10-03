import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {EndpointsService} from '../../endpoints/endpoints.service';
import {MatDialog} from '@angular/material/dialog';
import {AddAppDialogComponent} from '../../components/add-app-dialog/add-app-dialog.component';
import { Subject } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-app-management',
  templateUrl: './app-management.component.html',
  styleUrls: ['./app-management.component.css']
})
export class AppManagementComponent implements OnInit {

  constructor(
    protected endpointsService: EndpointsService,
    public dialog: MatDialog,
    public translate: TranslateService,
    private toastr: ToastrService) { }
    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource= new MatTableDataSource();
  displayedColumns: string[] = ['name'];
  apps = [];
  load = true;
  itemsPerPage: string;
  selectedRow = null;
  focusApp: any = {};
  newFocusApp: any = {};
  change = false;
  appControl = new FormControl('', Validators.required);
  eventsSubject: Subject<void> = new Subject<void>();
  info: boolean;
  ngOnInit(): void {
    this.getActiveApp();
    this.translate.get('itemsPerPage').subscribe(res => {
      this.itemsPerPage  = res;
    });
  }


  emitEventToHeader() {
    this.eventsSubject.next();
  }
  getApps(){
    this.endpointsService.getApps().subscribe((data: {data: any[], ok: boolean}) => { // Success
        this.apps = data.data;
        this.dataSource.data = this.apps;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = this.itemsPerPage;
        let index;
        if(this.focusApp !== null){
          for (let i = 0; i < this.apps.length; i++){
            if (this.apps[i].code === this.focusApp.code){
              index = i;
            }
          }
          this.newFocusApp = this.apps[index];
        }
        this.load = false;
      },
      (error) => {
        console.error(error);
      });
  }
  getActiveApp(){
    this.endpointsService.getActiveApp().subscribe((data: {data: object, ok: boolean}) => { // Success
        this.focusApp = data.data;
        this.getApps();
      },
      (error) => {
        console.error(error);
      });
  }
  changeFocus(){
    this.change = true;
  }
  cancelChange(){
    this.change = false;
  }
  submitChange(){
    this.endpointsService.changeActiveApp({app_code: this.newFocusApp.code}).subscribe((data: {data: object, ok: boolean}) => { // Success
        this.getActiveApp();
        this.emitEventToHeader();
        this.change = false;
      },
      (error) => {
        console.error(error);
      });
  }
  openAddAppDialog() {
    let message, successMessage;
    this.translate.get('appManagement.addAppTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('appManagement.addSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddAppDialogComponent, {
      data: {message, withCode: false},
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        res.owner = user.username;
        this.endpointsService.postApp(res).subscribe((data: { data: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.success(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getApps();
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  openEditAppDialog() {
    let message, successMessage;
    this.translate.get('appManagement.editAppTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('appManagement.editSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddAppDialogComponent, {
      data: {
        message,
        editData: this.selectedRow,
        withCode: true
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.endpointsService.putApp(res, this.selectedRow.code).subscribe((data: { data: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.info(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getApps();
            this.selectedRow = null;
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  deleteApp(){
    let successMessage, confirmMessage;
    this.translate.get('appManagement.deleteSuccess').subscribe(res => {
      successMessage = res;
    });
    this.translate.get('appManagement.deleteConfirm').subscribe(res => {
      confirmMessage = res;
    });
    if(confirm(confirmMessage)){
      this.endpointsService.deleteApp( this.selectedRow.code).subscribe( () => {
        this.toastr.error(successMessage, null, {
          timeOut: 10000,
          positionClass: 'toast-center-center'
        });
        this.getApps();
        this.selectedRow = null;
      },  (error) => {
        console.error(error);
      });
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  select(row){
    this.selectedRow = row;
  }

}
