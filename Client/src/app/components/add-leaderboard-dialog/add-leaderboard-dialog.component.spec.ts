import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeaderboardDialogComponent } from './add-leaderboard-dialog.component';

describe('AddLeaderboardDialogComponent', () => {
  let component: AddLeaderboardDialogComponent;
  let fixture: ComponentFixture<AddLeaderboardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLeaderboardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeaderboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
