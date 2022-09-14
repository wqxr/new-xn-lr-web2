import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShanghaiDataDockingComponent } from './shanghai-data-docking.component';

describe('ShanghaiDataDockingComponent', () => {
  let component: ShanghaiDataDockingComponent;
  let fixture: ComponentFixture<ShanghaiDataDockingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShanghaiDataDockingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShanghaiDataDockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
