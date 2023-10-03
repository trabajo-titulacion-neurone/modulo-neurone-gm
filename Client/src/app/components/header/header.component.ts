import {Component, Input, OnInit} from '@angular/core';
import {EndpointsService} from '../../endpoints/endpoints.service';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    protected endpointsService: EndpointsService,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  focusApp: any = {};
  private eventsSubscription: Subscription;
  @Input() marked: string;
  @Input() events: Observable<void>;
  design = false;
  players = false;
  management = false;
  home = false;
  ngOnInit(): void {
    // traer app activa
    this.getActiveApp();
    if (this.events) {
      this.eventsSubscription = this.events.subscribe(() => this.getActiveApp());
    }
    // con este switch se resalta la etiqueta del header en la que se encuentra el usuario
    switch (this.marked) {
      case 'design':
        this.design = true;
        break;
      case 'players':
        this.players = true;
        break;
      case 'management':
        this.management = true;
        break;
      case 'home':
        this.home = true;
        break;
      default:
        break;
    }
  }
  getActiveApp(){
    this.endpointsService.getActiveApp().subscribe((data: {data: object, ok: boolean}) => { // Success
        this.focusApp = data.data;
      },
      (error) => {
        console.error(error);
      });
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
