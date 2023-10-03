import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignChallengesComponent } from './design-challenges.component';

describe('DesignChallengesComponent', () => {
  let component: DesignChallengesComponent;
  let fixture: ComponentFixture<DesignChallengesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignChallengesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
