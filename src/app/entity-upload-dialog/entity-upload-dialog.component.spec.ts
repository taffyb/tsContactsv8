import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityUploadDialogComponent } from './entity-upload-dialog.component';

describe('EntityUploadDialogComponent', () => {
  let component: EntityUploadDialogComponent;
  let fixture: ComponentFixture<EntityUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
