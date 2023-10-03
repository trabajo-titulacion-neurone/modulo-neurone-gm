import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {EndpointsService} from '../../endpoints/endpoints.service';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-design-leaderboards-see',
  templateUrl: './design-leaderboards-see.component.html',
  styleUrls: ['./design-leaderboards-see.component.css']
})
export class DesignLeaderboardsSeeComponent implements OnInit {

  constructor(private route: ActivatedRoute, protected endpointsService: EndpointsService, public translate: TranslateService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  code: string;
  focusApp: any = {};
  load = true;
  leaderboard: any = {};
  displayedColumns: string[] = ['rank', 'name', 'last_name', 'amount'];
  dataSource= new MatTableDataSource();
  translation: string = "";
  ok = false;
  name: string;
  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.code = params.get('code');
     });
    this.getActiveApp();
  }
  getActiveApp(){
    this.endpointsService.getActiveApp().subscribe((data: {data: object, ok: boolean}) => { // Success
        this.focusApp = data.data;
        this.getData();
        this.getLeaderboard();
      },
      (error) => {
        console.error(error);
      });
  }
  getLeaderboard(){
    this.endpointsService.getOneLeaderboard(this.focusApp.code, this.code).subscribe((data: {data: any, ok: boolean})=> {
      this.leaderboard = data.data;
      if(this.leaderboard.parameter === "actions"){
        this.translate.get('actions').subscribe(res => {
          this.translation = res;
        });
        this.endpointsService.getOneAction(this.focusApp.code, this.leaderboard.element_code).subscribe((data: {data: any, ok:boolean}) => {
          this.name = data.data.name
        },(error) => {
          console.error(error);
        })
      }
      else if(this.leaderboard.parameter === "points"){
        this.translate.get('points').subscribe(res => {
          this.translation = res;
        });
        this.endpointsService.getOnePoint(this.focusApp.code, this.leaderboard.element_code).subscribe((data: {data: any, ok:boolean}) => {
          this.name = data.data.name
        },(error) => {
          console.error(error);
        })
      }
    },(error) => {
      console.error(error);
    })
  }
  getData(){
    this.endpointsService.getLeaderboardData(this.focusApp.code, this.code).subscribe((data: {leaderboardResult: any, ok: boolean}) => { // Success
        this.dataSource.data = data.leaderboardResult;
        this.dataSource.paginator = this.paginator;
        this.load = false;
      },
      (error) => {
        console.error(error);
      });
  }

}
