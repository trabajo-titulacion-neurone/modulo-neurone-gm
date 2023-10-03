import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {EndpointsService} from '../../endpoints/endpoints.service';
import {MatDialog} from '@angular/material/dialog';
import {AddLevelDialogComponent} from '../../components/add-level-dialog/add-level-dialog.component';
import {TranslateService} from "@ngx-translate/core";
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-design-levels',
  templateUrl: './design-levels.component.html',
  styleUrls: ['./design-levels.component.css']
})
export class DesignLevelsComponent implements OnInit {

  constructor(protected endpointsService: EndpointsService, public dialog: MatDialog, public translate: TranslateService,  private toastr: ToastrService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource= new MatTableDataSource();
  levels = [];
  itemsPerPage: string;
  points = [];
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

  getActiveApp(){
    this.endpointsService.getActiveApp().subscribe((data: {data: object, ok: boolean}) => { // Success
        this.focusApp = data.data;
        this.getLevels();
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
      },
      (error) => {
        console.error(error);
      });
  }
  getLevels(){
    this.endpointsService.getLevels(this.focusApp.code).subscribe((data: {
        data: any[]; ok: boolean} ) => { // Success
        this.levels = data.data;
        this.dataSource.data = this.levels;
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = this.itemsPerPage;
        this.load = false;
      },
      (error) => {
        console.error(error);
      });
  }

  openAddLevelDialog() {
    let message, successMessage;
    this.translate.get('level.addLevelTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('level.addSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddLevelDialogComponent, {
      data: {
        message,
        points: this.points,
        withCode: false}
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const formData = new FormData();
        formData.append('name', res.name);
        formData.append('description', res.description);
        formData.append('point_required', res.point_required);
        formData.append('point_threshold', res.point_threshold);
        formData.append('file', res.file);
        this.endpointsService.postLevel(formData, this.focusApp.code).subscribe((data: { data: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.success(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getLevels();
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  openEditLevelDialog() {
    let message, successMessage;
    this.translate.get('level.editLevelTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('level.editSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddLevelDialogComponent, {
      data: {
        message,
        editData: this.selectedRow,
        points: this.points,
        withCode: true
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const formData = new FormData();
        formData.append('name', res.name);
        formData.append('code', res.code);
        formData.append('description', res.description);
        formData.append('point_required', res.point_required);
        formData.append('point_threshold', res.point_threshold);
        formData.append('file', res.file);
        this.endpointsService.putLevel(formData, this.focusApp.code, this.selectedRow.code).subscribe((data: { data: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.info(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getLevels();
            this.selectedRow = null;
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }
  deleteLevel(){
    let successMessage;
    let confirmMessage;
    this.translate.get('level.deleteSuccess').subscribe(res => {
      successMessage = res;
    });
    this.translate.get('level.deleteConfirm').subscribe(res => {
      confirmMessage = res;
    });
    if(confirm(confirmMessage)) {
      this.endpointsService.deleteLevel(this.focusApp.code, this.selectedRow.code).subscribe( () => {
        this.toastr.error(successMessage, null, {
          timeOut: 10000,
          positionClass: 'toast-center-center'
        });
        this.getLevels();
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
