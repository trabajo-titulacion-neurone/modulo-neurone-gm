import { Component, OnInit } from '@angular/core';
import {EndpointsService} from '../../endpoints/endpoints.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit {

  constructor(protected endpointsService: EndpointsService, private route: ActivatedRoute) { }
  code: string;
  eventsSubject: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.code = params.get('player_code');
     });
  }
  
  ngAfterViewInit(){
    this.emitEventToProfile();
  }

  emitEventToProfile() {
    this.eventsSubject.next();
  }


}
