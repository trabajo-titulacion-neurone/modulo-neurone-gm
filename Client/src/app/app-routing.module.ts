import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './helpers'

import {HomeComponent} from './views/home/home.component';
import {DesignComponent} from './views/design/design.component';
import {DesignPointsComponent} from './views/design-points/design-points.component';
import {DesignLevelsComponent} from './views/design-levels/design-levels.component';
import {DesignActionsComponent} from './views/design-actions/design-actions.component';
import {PlayersComponent} from './views/players/players.component';
import {AppManagementComponent} from './views/app-management/app-management.component';
import {DesignChallengesComponent} from './views/design-challenges/design-challenges.component';
import {DesignLeaderboardsComponent} from './views/design-leaderboards/design-leaderboards.component';
import {DesignBadgesComponent} from './views/design-badges/design-badges.component';
import {DesignLeaderboardsSeeComponent} from './views/design-leaderboards-see/design-leaderboards-see.component';
import { PlayerProfileComponent } from './views/player-profile/player-profile.component';
import { LoginComponent } from './views/login/login.component';
import { WebhooksComponent } from './views/webhooks/webhooks.component';



const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'design', component: DesignComponent, canActivate: [AuthGuard]},
  { path: 'design/points', component: DesignPointsComponent, canActivate: [AuthGuard]},
  { path: 'design/levels', component:  DesignLevelsComponent, canActivate: [AuthGuard]},
  { path: 'design/actions', component: DesignActionsComponent, canActivate: [AuthGuard]},
  { path: 'design/challenges', component: DesignChallengesComponent, canActivate: [AuthGuard]},
  { path: 'design/badges', component: DesignBadgesComponent, canActivate: [AuthGuard]},
  { path: 'design/leaderboards', component: DesignLeaderboardsComponent, canActivate: [AuthGuard]},
  { path: 'design/leaderboards/see/:code', component: DesignLeaderboardsSeeComponent, canActivate: [AuthGuard]},
  { path: 'players', component: PlayersComponent, canActivate: [AuthGuard]},
  { path: 'players/:player_code/profile', component: PlayerProfileComponent, canActivate: [AuthGuard]},
  { path: 'webhooks/:app_code', component: WebhooksComponent, canActivate: [AuthGuard]},
  { path: 'management', component: AppManagementComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
