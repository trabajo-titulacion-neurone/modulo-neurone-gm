import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignActionsComponent } from './design-actions.component';

describe('DesignActionsComponent', () => {
  let component: DesignActionsComponent;
  let fixture: ComponentFixture<DesignActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
