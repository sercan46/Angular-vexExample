import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailLabelComponent } from './mail-label.component';

describe('MailLabelComponent', () => {
  let component: MailLabelComponent;
  let fixture: ComponentFixture<MailLabelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailLabelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
