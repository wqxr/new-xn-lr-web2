import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesArchiveComponent } from './files-archive.component';

describe('FilesArchiveComponent', () => {
  let component: FilesArchiveComponent;
  let fixture: ComponentFixture<FilesArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
