import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {EndpointsService} from '../../endpoints/endpoints.service';
import { AddActionDialogComponent} from '../../components/add-action-dialog/add-action-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-design-actions',
  templateUrl: './design-actions.component.html',
  styleUrls: ['./design-actions.component.css']
})
export class DesignActionsComponent implements OnInit {

  constructor(protected endpointsService: EndpointsService, public dialog: MatDialog, public translate: TranslateService, private toastr: ToastrService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource= new MatTableDataSource();
  itemsPerPage: string;
  load = true;
  yes: string;
  no: string;
  actions = [];
  displayedColumns: string[] = ['name'];
  selectedRow = null;
  focusApp: any = {};
  ngOnInit(): void {
    this.getActiveApp();
    this.translate.get('itemsPerPage').subscribe(res => {
      this.itemsPerPage  = res;
    });
    this.translate.get('yes').subscribe(res => {
      this.yes  = res;
    });
    this.translate.get('no').subscribe(res => {
      this.no  = res;
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
        this.getActions();
      },
      (error) => {
        console.error(error);
      });
  }
  getActions(){
    this.endpointsService.getActions(this.focusApp.code).subscribe((data: {
        actions: any[]; ok: boolean} ) => { // Success
        this.actions = data.actions;
        for(let i = 0; i<this.actions.length; i++){
          if(this.actions[i].repeatable){
            this.actions[i].displayRepeatable = this.yes;
          }
          else{
            this.actions[i].displayRepeatable = this.no;
          }
        }
        this.dataSource.data = this.actions;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = this.itemsPerPage;
        this.load = false;
      },
      (error) => {
        console.error(error);
      });
  }

  openAddActionDialog() {
    let message;
    let successMessage;
    this.translate.get('action.addActionTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('action.addSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddActionDialogComponent, {
      data: {message, withCode: false},
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const formData = new FormData();
        formData.append('name', res.name);
        formData.append('description', res.description);
        formData.append('repeatable', res.repeatable.toString());
        formData.append('file', res.file);
        this.endpointsService.postAction(formData, this.focusApp.code).subscribe((data: { action: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.success(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getActions();
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  openEditActionDialog() {
    let message;
    let successMessage;
    this.translate.get('action.editActionTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('action.editSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddActionDialogComponent, {
      data: {
        message,
        editData: this.selectedRow,
        withCode: true
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const formData = new FormData();
        formData.append('name', res.name);
        formData.append('description', res.description);
        formData.append('repeatable', res.repeatable.toString());
        formData.append('file', res.file);
        formData.append('code', res.code);
        this.endpointsService.putAction(formData, this.focusApp.code, this.selectedRow.code).subscribe((data: { action: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.info(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getActions();
            this.selectedRow = null;
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  deleteAction(){
    let successMessage;
    let confirmMessage;
    this.translate.get('action.deleteSuccess').subscribe(res => {
      successMessage = res;
    });
    this.translate.get('action.deleteConfirm').subscribe(res => {
      confirmMessage = res;
    });
    if(confirm(confirmMessage)) {
      this.endpointsService.deleteAction(this.focusApp.code, this.selectedRow.code).subscribe( () => {
        this.toastr.error(successMessage, null, {
          timeOut: 10000,
          positionClass: 'toast-center-center'
        });
        this.getActions();
        this.selectedRow = null;
      },  (error) => {
        console.error(error);
      });
    }
  }



}
