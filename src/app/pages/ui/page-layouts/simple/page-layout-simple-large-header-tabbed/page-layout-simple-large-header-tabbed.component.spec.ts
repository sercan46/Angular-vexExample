import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageLayoutSimpleLargeHeaderTabbedComponent } from './page-layout-simple-large-header-tabbed.component';

describe('PageLayoutSimpleLargeHeaderTabbedComponent', () => {
  let component: PageLayoutSimpleLargeHeaderTabbedComponent;
  let fixture: ComponentFixture<PageLayoutSimpleLargeHeaderTabbedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageLayoutSimpleLargeHeaderTabbedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLayoutSimpleLargeHeaderTabbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
