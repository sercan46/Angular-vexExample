import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelpCenterFaqComponent } from './help-center-faq.component';

describe('HelpCenterFaqComponent', () => {
  let component: HelpCenterFaqComponent;
  let fixture: ComponentFixture<HelpCenterFaqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HelpCenterFaqComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCenterFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
