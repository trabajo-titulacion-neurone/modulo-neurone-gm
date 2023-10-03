import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { EndpointsService } from 'src/app/endpoints/endpoints.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() playerCode: string;
  @Input() events: Observable<void>;
  eventsSubscription: Subscription;
  player: any;
  focusApp: any;
  load = true;
  completedChallenges = [];
  playerPoints = [];
  playerActions = [];
  playerBadges = [];
  playerLevels = [];
  playersActionTotal = [];
  constructor(protected endpointsService: EndpointsService) { }

  ngOnInit(): void {
    if (this.events) {
      this.eventsSubscription = this.events.subscribe(() => this.getActiveApp());
    }
  }

  getActiveApp(){
    this.endpointsService.getActiveApp().subscribe((data: {data: object, ok: boolean}) => { // Success
        this.focusApp = data.data;
        this.getPlayer();
      },
      (error) => {
        console.error(error);
      });
  }

  getPlayer(){
    this.endpointsService.getPlayer(this.focusApp.code, this.playerCode).subscribe((data: {data: any[], ok: boolean}) => { // Success
        this.player = data.data;
        this.getPlayerCompletedChallenges();
        this.getPlayerPoints();
        this.getPlayerActions();
        this.getPlayerBadges();
        this.getPlayerLevels();
      },
      (error) => {
        console.error(error);
      });
  }

  getPlayerCompletedChallenges(){
    this.endpointsService.getPlayerCompletedChallenges(this.focusApp.code, this.player.code).subscribe((data: {data: any[], ok: boolean}) => { // Success
      this.completedChallenges = data.data;
      console.log(this.completedChallenges)
    },
    (error) => {
      console.error(error);
    });
  }
  getPlayerPoints(){
    this.endpointsService.getPlayerPoints(this.focusApp.code, this.player.code).subscribe((data: {data: any[], ok: boolean}) => { // Success
      this.playerPoints = data.data;
    },
    (error) => {
      console.error(error);
    });
  }
  getPlayerActions(){
    this.endpointsService.getPlayerActions(this.focusApp.code, this.player.code).subscribe((data: {actions: any[], ok: boolean}) => { // Success
      let array = data.actions;
      this.playersActionTotal = array;
      array = array.reverse();
      array = array.slice(0,5);
      this.playerActions = array;
    },
    (error) => {
      console.error(error);
    });
  }
  getPlayerBadges(){
    this.endpointsService.getPlayerBadges(this.focusApp.code, this.player.code).subscribe((data: {data: any[], ok: boolean}) => { // Success
      this.playerBadges = data.data;
    },
    (error) => {
      console.error(error);
    });
  }
  getPlayerLevels(){
    this.endpointsService.getPlayerLevels(this.focusApp.code, this.player.code).subscribe((data: {data: any[], ok: boolean}) => { // Success
      this.playerLevels = data.data;
      this.load = false;
    },
    (error) => {
      console.error(error);
    });
  }

}
