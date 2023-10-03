import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChallengeDialogComponent } from './add-challenge-dialog.component';

describe('AddChallengeDialogComponent', () => {
  let component: AddChallengeDialogComponent;
  let fixture: ComponentFixture<AddChallengeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChallengeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChallengeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
