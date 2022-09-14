import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateShanghaiComponent } from './estate-shanghai.component';

describe('EstateShanghaiComponent', () => {
  let component: EstateShanghaiComponent;
  let fixture: ComponentFixture<EstateShanghaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateShanghaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateShanghaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
