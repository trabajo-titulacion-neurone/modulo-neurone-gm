import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignBadgesComponent } from './design-badges.component';

describe('DesignBadgesComponent', () => {
  let component: DesignBadgesComponent;
  let fixture: ComponentFixture<DesignBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignBadgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
