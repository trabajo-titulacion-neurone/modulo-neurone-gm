import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPointDialogComponent } from './add-point-dialog.component';

describe('AddPointDialogComponent', () => {
  let component: AddPointDialogComponent;
  let fixture: ComponentFixture<AddPointDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPointDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
