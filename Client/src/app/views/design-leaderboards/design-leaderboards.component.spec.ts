import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLeaderboardsComponent } from './design-leaderboards.component';

describe('DesignLeaderboardsComponent', () => {
  let component: DesignLeaderboardsComponent;
  let fixture: ComponentFixture<DesignLeaderboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignLeaderboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLeaderboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
