import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IconsIcComponent } from './icons-ic.component';

describe('IconsIcComponent', () => {
  let component: IconsIcComponent;
  let fixture: ComponentFixture<IconsIcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IconsIcComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconsIcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
