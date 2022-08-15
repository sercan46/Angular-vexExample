import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailListEntryComponent } from './mail-list-entry.component';

describe('MailListEntryComponent', () => {
  let component: MailListEntryComponent;
  let fixture: ComponentFixture<MailListEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailListEntryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
