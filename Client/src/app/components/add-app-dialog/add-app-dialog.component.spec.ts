import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppDialogComponent } from './add-app-dialog.component';

describe('AddAppDialogComponent', () => {
  let component: AddAppDialogComponent;
  let fixture: ComponentFixture<AddAppDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAppDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAppDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
