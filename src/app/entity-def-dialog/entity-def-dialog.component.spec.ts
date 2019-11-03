import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDefDialogComponent } from './entity-def-dialog.component';

describe('EntityDefDialogComponent', () => {
  let component: EntityDefDialogComponent;
  let fixture: ComponentFixture<EntityDefDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDefDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDefDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
