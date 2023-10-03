import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLevelsComponent } from './design-levels.component';

describe('DesignLevelsComponent', () => {
  let component: DesignLevelsComponent;
  let fixture: ComponentFixture<DesignLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
