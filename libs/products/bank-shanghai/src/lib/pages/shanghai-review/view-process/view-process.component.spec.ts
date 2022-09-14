import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProcessComponent } from './view-process.component';

describe('ReviewProcessComponent', () => {
  let component: ViewProcessComponent;
  let fixture: ComponentFixture<ViewProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProcessComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
