import { Component, OnInit } from '@angular/core';
import {EndpointsService} from '../../endpoints/endpoints.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(protected endpointsService: EndpointsService, private router: Router) { }
  focusApp: any = {};
  summary: any = {};
  ngOnInit(): void {
    this.getActiveApp();
  }
  getActiveApp(){
    this.endpointsService.getActiveApp().subscribe((data: {data: object, ok: boolean}) => { // Success
        this.focusApp = data.data;
        this.getSummary();
      },
      (error) => {
        console.error(error);
      });
  }
  getSummary(){
    this.endpointsService.getAppSummary(this.focusApp.code).subscribe((data: any) => {
      this.summary = data;
    },
      (error) => {
        console.error(error);
      });
  }
}
