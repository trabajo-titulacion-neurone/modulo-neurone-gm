import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent implements OnInit {

  constructor() { }
  @Input() marked: string;
  points = false;
  levels = false;
  challenges = false;
  actions = false;
  badges = false;
  groups = false;
  leaderboards = false;
  ngOnInit(): void {
    // con este switch se resalta la etiqueta del sidebar en la que se encuentra el usuario
    switch (this.marked) {
      case 'points':
        this.points = true;
        break;
      case 'levels':
        this.levels = true;
        break;
      case 'actions':
        this.actions = true;
        break;
      case 'challenges':
        this.challenges = true;
        break;
      case 'badges':
        this.badges = true;
        break;
      case 'leaderboards':
        this.leaderboards = true;
        break;
      case 'groups':
        this.groups = true;
        break;
      default:
        break;
    }
  }

}
