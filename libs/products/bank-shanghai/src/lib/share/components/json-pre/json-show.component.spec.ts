import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonShowComponent } from './json-show.component';

describe('JsonShowComponent', () => {
  let component: JsonShowComponent;
  let fixture: ComponentFixture<JsonShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
