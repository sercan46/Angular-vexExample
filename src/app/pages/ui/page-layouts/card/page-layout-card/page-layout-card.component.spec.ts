import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageLayoutCardComponent } from './page-layout-card.component';

describe('PageLayoutCardComponent', () => {
  let component: PageLayoutCardComponent;
  let fixture: ComponentFixture<PageLayoutCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageLayoutCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLayoutCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
