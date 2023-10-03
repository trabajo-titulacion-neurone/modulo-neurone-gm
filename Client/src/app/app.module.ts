import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './views/home/home.component';
import { DesignComponent } from './views/design/design.component';
import { DesignPointsComponent } from './views/design-points/design-points.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import { DesignLevelsComponent } from './views/design-levels/design-levels.component';
import { PlayersComponent } from './views/players/players.component';
import {MatCardModule} from '@angular/material/card';
import { AppManagementComponent } from './views/app-management/app-management.component';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DesignActionsComponent } from './views/design-actions/design-actions.component';
import {EndpointsService} from './endpoints/endpoints.service';
import { AddActionDialogComponent } from './components/add-action-dialog/add-action-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DesignChallengesComponent } from './views/design-challenges/design-challenges.component';
import { AddPointDialogComponent } from './components/add-point-dialog/add-point-dialog.component';
import { AddLevelDialogComponent } from './components/add-level-dialog/add-level-dialog.component';
import { AddChallengeDialogComponent } from './components/add-challenge-dialog/add-challenge-dialog.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material/core';
import { AddAppDialogComponent } from './components/add-app-dialog/add-app-dialog.component';

import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { DesignLeaderboardsComponent } from './views/design-leaderboards/design-leaderboards.component';
import { DesignBadgesComponent } from './views/design-badges/design-badges.component';
import { AddLeaderboardDialogComponent } from './components/add-leaderboard-dialog/add-leaderboard-dialog.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DesignLeaderboardsSeeComponent } from './views/design-leaderboards-see/design-leaderboards-see.component';
import { PlayerProfileComponent } from './views/player-profile/player-profile.component';
import { AddBadgeDialogComponent } from './components/add-badge-dialog/add-badge-dialog.component';
import { LoginComponent } from './views/login/login.component';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WebhooksComponent } from './views/webhooks/webhooks.component';
import { AddPlayerDialogComponent } from './components/add-player-dialog/add-player-dialog.component';
import { ProfileComponent } from './components/profile/profile.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    DesignComponent,
    DesignPointsComponent,
    DesignLevelsComponent,
    PlayersComponent,
    AppManagementComponent,
    DesignActionsComponent,
    AddActionDialogComponent,
    AddPointDialogComponent,
    DesignChallengesComponent,
    AddLevelDialogComponent,
    AddChallengeDialogComponent,
    AddAppDialogComponent,
    DesignLeaderboardsComponent,
    DesignBadgesComponent,
    AddLeaderboardDialogComponent,
    DesignLeaderboardsSeeComponent,
    PlayerProfileComponent,
    AddBadgeDialogComponent,
    LoginComponent,
    WebhooksComponent,
    AddPlayerDialogComponent,
    ProfileComponent,
  ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(), // ToastrModule 
        AppRoutingModule,
        MatButtonModule,
        MatTableModule,
        MatInputModule,
        MatCardModule,
        MatSelectModule,
        HttpClientModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatDialogModule,
        FormsModule,
        MatListModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MatStepperModule
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: MAT_DATE_LOCALE, useValue: navigator.language},
    EndpointsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
