import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelpCenterGuidesGuideComponent } from './help-center-guides-guide.component';

describe('HelpCenterGuidesGuideComponent', () => {
  let component: HelpCenterGuidesGuideComponent;
  let fixture: ComponentFixture<HelpCenterGuidesGuideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HelpCenterGuidesGuideComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCenterGuidesGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
