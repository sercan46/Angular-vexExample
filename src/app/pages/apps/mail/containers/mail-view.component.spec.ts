import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailViewComponent } from './mail-view.component';

describe('MailViewComponent', () => {
  let component: MailViewComponent;
  let fixture: ComponentFixture<MailViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
