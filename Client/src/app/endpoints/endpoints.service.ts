import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  constructor(protected http: HttpClient) { }

  rootURL = 'http://localhost:3080/api/';

  /* APPS */
  getActiveApp() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(this.rootURL + 'applications/'+ user.username + '/focus');
  }
  getApps() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(this.rootURL + 'applications/' + user.username + '/userApps');
  }
  changeActiveApp(newActive){
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.post(this.rootURL + 'applications/'+ user.username + '/changeActive', newActive);
  }
  postApp(newApp){
    return this.http.post(this.rootURL + 'applications', newApp);
  }
  putApp(updatedApp, appCode){
    return this.http.put(this.rootURL + 'applications/' + appCode, updatedApp);
  }
  deleteApp(appCode){
    return this.http.delete(this.rootURL + 'applications/' + appCode);
  }
  getAppSummary(appCode){
    return this.http.get(this.rootURL + 'applications/' + appCode + '/summary');
  }
  /* WEBHOOKS */
  getWebhooks(appCode){
    return this.http.get(this.rootURL + appCode + '/webhooks');
  }
  updateWebhooks(webhooks, appCode){
    return this.http.put(this.rootURL + appCode + '/webhooks', webhooks);
  }
  /* PLAYERS */
  getPlayers(appCode){
    return this.http.get(this.rootURL + appCode + '/players');
  }
  postPlayer(newPlayer, appCode){
    return this.http.post(this.rootURL + appCode + '/players', newPlayer)
  }
  getPlayer(appCode, playerCode){
    return this.http.get(this.rootURL + appCode + '/players/' + playerCode);
  }
  getPlayerCompletedChallenges(appCode, playerCode){
    return this.http.get(this.rootURL + appCode + '/players/' + playerCode + '/completed-challenges');
  }
  getPlayerPoints(appCode, playerCode){
    return this.http.get(this.rootURL + appCode + '/players/' + playerCode + '/player-points');
  }
  getPlayerActions(appCode, playerCode){
    return this.http.get(this.rootURL + appCode + '/players/' + playerCode + '/actions');
  }
  getPlayerBadges(appCode, playerCode){
    return this.http.get(this.rootURL + appCode + '/players/' + playerCode + '/badges');
  }
  getPlayerLevels(appCode, playerCode){
    return this.http.get(this.rootURL + appCode + '/players/' + playerCode + '/player-levels');
  }
  /* ACTIONS */
  getActions(appCode){
    return this.http.get(this.rootURL + appCode + '/actions');
  }
  postAction(newAction, appCode){
    return this.http.post(this.rootURL + appCode + '/actions', newAction);
  }
  putAction(updatedAction, appCode, actionCode){
    return this.http.put( this.rootURL + appCode + '/actions/' + actionCode, updatedAction);
  }
  deleteAction(appCode, actionCode){
    return this.http.delete( this.rootURL + appCode + '/actions/' + actionCode);
  }
  getOneAction(appCode, actionCode){
    return this.http.get(this.rootURL + appCode + '/actions/' + actionCode);
  }
  /* POINTS */
  getPoints(appCode){
    return this.http.get(this.rootURL + appCode + '/points');
  }
  postPoint(newPoint, appCode){
    return this.http.post(this.rootURL + appCode + '/points', newPoint);
  }
  putPoint(updatedPoint, appCode, pointCode){
    return this.http.put( this.rootURL + appCode + '/points/' + pointCode, updatedPoint);
  }
  deletePoint(appCode, pointCode){
    return this.http.delete( this.rootURL + appCode + '/points/' + pointCode);
  }
  getOnePoint(appcode, pointCode){
    return this.http.get( this.rootURL + appcode + '/points/' + pointCode);
  }
  /* LEVELS */
  getLevels(appCode){
    return this.http.get(this.rootURL + appCode + '/levels');
  }
  postLevel(newLevel, appCode){
    return this.http.post(this.rootURL + appCode + '/levels', newLevel);
  }
  putLevel(updatedLevel, appCode, levelCode){
    return this.http.put( this.rootURL + appCode + '/levels/' + levelCode, updatedLevel);
  }
  deleteLevel(appCode, levelCode){
    return this.http.delete( this.rootURL + appCode + '/levels/' + levelCode);
  }
  /* CHALLENGES */
  getChallenges(appCode){
    return this.http.get(this.rootURL + appCode + '/challenges');
  }
  postChallenge(newChallenge, appCode){
    return this.http.post(this.rootURL + appCode + '/challenges', newChallenge);
  }
  putChallenge(updatedChallenge, appCode, challengeCode){
    return this.http.put( this.rootURL + appCode + '/challenges/' + challengeCode, updatedChallenge);
  }
  deleteChallenge(appCode, challengeCode){
    return this.http.delete( this.rootURL + appCode + '/challenges/' + challengeCode);
  }
  /* LEADERBOARDS */
  getLeaderboards(appCode){
    return this.http.get(this.rootURL + appCode + '/leaderboards');
  }
  postLeaderboards(newLeaderboard, appCode){
    return this.http.post(this.rootURL + appCode + '/leaderboards', newLeaderboard);
  }
  putLeaderboard(updatedLeaderboard, appCode, leaderboardCode){
    return this.http.put( this.rootURL + appCode + '/leaderboards/' + leaderboardCode, updatedLeaderboard);
  }
  deleteLeaderboard(appCode, leaderboardCode){
    return this.http.delete( this.rootURL + appCode + '/leaderboards/' + leaderboardCode);
  }
  getLeaderboardData(appCode, leaderboardCode){
    return this.http.post(this.rootURL + appCode + '/leaderboards/' + leaderboardCode + '/generate', null);
  }
  getOneLeaderboard(appCode, leaderboardCode){
    return this.http.get(this.rootURL + appCode + '/leaderboards/' + leaderboardCode);
  }

   /* BADGES */
   getBadges(appCode){
    return this.http.get(this.rootURL + appCode + '/badges');
  }
  postBadges(newBadge, appCode){
    return this.http.post(this.rootURL + appCode + '/badges', newBadge);
  }
  putBadge(updatedLevel, appCode, badgeCode){
    return this.http.put( this.rootURL + appCode + '/badges/' + badgeCode, updatedLevel);
  }
  deleteBadge(appCode, badgeCode){
    return this.http.delete( this.rootURL + appCode + '/badges/' + badgeCode);
  }
}
