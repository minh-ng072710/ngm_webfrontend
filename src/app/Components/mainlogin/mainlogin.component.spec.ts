import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainloginComponent } from './mainlogin.component';

describe('MainloginComponent', () => {
  let component: MainloginComponent;
  let fixture: ComponentFixture<MainloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
