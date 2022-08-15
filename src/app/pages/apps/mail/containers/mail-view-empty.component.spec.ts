import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailViewEmptyComponent } from './mail-view-empty.component';

describe('MailViewEmptyComponent', () => {
  let component: MailViewEmptyComponent;
  let fixture: ComponentFixture<MailViewEmptyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MailViewEmptyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailViewEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
