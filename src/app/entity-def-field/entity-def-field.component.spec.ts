import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDefFieldComponent } from './entity-def-field.component';

describe('EntityDefFieldComponent', () => {
  let component: EntityDefFieldComponent;
  let fixture: ComponentFixture<EntityDefFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDefFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDefFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
