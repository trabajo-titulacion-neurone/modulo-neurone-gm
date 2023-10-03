import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {EndpointsService} from '../../endpoints/endpoints.service';
import {MatDialog} from '@angular/material/dialog';
import {AddPointDialogComponent} from '../../components/add-point-dialog/add-point-dialog.component';
import {TranslateService} from "@ngx-translate/core";
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-design-points',
  templateUrl: './design-points.component.html',
  styleUrls: ['./design-points.component.css']
})
export class DesignPointsComponent implements OnInit {

  constructor(protected endpointsService: EndpointsService, public dialog: MatDialog, public translate: TranslateService, private toastr: ToastrService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource= new MatTableDataSource();
  points = [];
  load = true;
  itemsPerPage: string;
  displayedColumns: string[] = ['name'];
  selectedRow = null;
  focusApp: any = {};
  ngOnInit(): void {
    this.getActiveApp();
    this.translate.get('itemsPerPage').subscribe(res => {
      this.itemsPerPage  = res;
    });
  }
  getActiveApp(){
    this.endpointsService.getActiveApp().subscribe((data: {data: object, ok: boolean}) => { // Success
        this.focusApp = data.data;
        this.getPoints();
      },
      (error) => {
        console.error(error);
      });
  }
  getPoints(){
    this.endpointsService.getPoints(this.focusApp.code).subscribe((data: {
        data: any[]; ok: boolean} ) => { // Success
        this.points = data.data;
        this.dataSource.data = this.points;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = this.itemsPerPage;
        this.load = false;
      },
      (error) => {
        console.error(error);
      });
  }
  openAddPointDialog() {
    let message, successMessage;
    this.translate.get('point.addPointTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('point.addSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddPointDialogComponent, {
      data: {message, withCode: false},
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const formData = new FormData();
        formData.append('name', res.name);
        formData.append('abbreviation', res.abbreviation);
        formData.append('initial_points', res.initial_points);
        formData.append('max_points', res.max_points);
        formData.append('daily_max', res.daily_max);
        formData.append('is_default', res.is_default.toString());
        formData.append('hidden', res.hidden.toString());
        formData.append('file', res.file);
        this.endpointsService.postPoint(formData, this.focusApp.code).subscribe((data: { data: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.success(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getPoints();
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  openEditPointDialog() {
    let message, successMessage;
    this.translate.get('point.editPointTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('point.editSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddPointDialogComponent, {
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
        formData.append('code', res.code);
        formData.append('abbreviation', res.abbreviation);
        formData.append('initial_points', res.initial_points);
        formData.append('max_points', res.max_points);
        formData.append('daily_max', res.daily_max);
        formData.append('is_default', res.is_default.toString());
        formData.append('hidden', res.hidden.toString());
        formData.append('file', res.file);
        this.endpointsService.putPoint(formData, this.focusApp.code, this.selectedRow.code).subscribe((data: { point: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.info(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getPoints();
            this.selectedRow = null;
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  deletePoint(){
    let successMessage, confirmMessage;
    this.translate.get('point.deleteSuccess').subscribe(res => {
      successMessage = res;
    });
    this.translate.get('point.deleteConfirm').subscribe(res => {
      confirmMessage = res;
    });
    if(confirm(confirmMessage)){
      this.endpointsService.deletePoint(this.focusApp.code, this.selectedRow.code).subscribe( () => {
        this.toastr.error(successMessage, null, {
          timeOut: 10000,
          positionClass: 'toast-center-center'
        });
        this.getPoints();
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
