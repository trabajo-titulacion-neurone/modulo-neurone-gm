import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLeaderboardsSeeComponent } from './design-leaderboards-see.component';

describe('DesignLeaderboardsSeeComponent', () => {
  let component: DesignLeaderboardsSeeComponent;
  let fixture: ComponentFixture<DesignLeaderboardsSeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignLeaderboardsSeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLeaderboardsSeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
