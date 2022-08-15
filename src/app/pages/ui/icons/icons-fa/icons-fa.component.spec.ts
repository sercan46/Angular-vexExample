import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IconsFaComponent } from './icons-fa.component';

describe('IconsFaComponent', () => {
  let component: IconsFaComponent;
  let fixture: ComponentFixture<IconsFaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IconsFaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconsFaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
