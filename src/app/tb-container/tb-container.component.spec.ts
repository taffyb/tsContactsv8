import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TbContainerComponent } from './tb-container.component';

describe('TbContainerComponent', () => {
  let component: TbContainerComponent;
  let fixture: ComponentFixture<TbContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TbContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TbContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
