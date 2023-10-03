import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AddPlayerDialogComponent } from 'src/app/components/add-player-dialog/add-player-dialog.component';
import {EndpointsService} from '../../endpoints/endpoints.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  constructor(public dialog: MatDialog, protected endpointsService: EndpointsService, public translate: TranslateService, private toastr: ToastrService) { }
  focusApp: any = {};
  players = [];
  ngOnInit(): void {
    this.getActiveApp();
  }
  getActiveApp(){
    this.endpointsService.getActiveApp().subscribe((data: {data: object, ok: boolean}) => { // Success
        this.focusApp = data.data;
        this.getPlayers();
      },
      (error) => {
        console.error(error);
      });
  }
  getPlayers(){
    this.endpointsService.getPlayers(this.focusApp.code).subscribe((data: {players: any[], ok: boolean}) => { // Success
        this.players = data.players;
      },
      (error) => {
        console.error(error);
      });
  }

  addPlayer() {
    let message;
    let successMessage;
    this.translate.get('playerProfile.addPlayerTitle').subscribe(res => {
      message = res;
    });
    this.translate.get('playerProfile.addSuccess').subscribe(res => {
      successMessage = res;
    });
    const dialogRef = this.dialog.open(AddPlayerDialogComponent, {
      data: {message, withCode: false},
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const formData = new FormData();
        formData.append('name', res.name);
        formData.append('last_name', res.last_name);
        formData.append('sourceId', res.sourceId);
        formData.append('file', res.file);
        this.endpointsService.postPlayer(formData, this.focusApp.code).subscribe((data: { data: any; ok: boolean }) => {
          if(data.ok){
            this.toastr.success(successMessage, null, {
              timeOut: 10000,
              positionClass: 'toast-center-center'
            });
            this.getPlayers();
          }
        }, (error) => {
          console.error(error);
        });
      }
    });
  }

}
