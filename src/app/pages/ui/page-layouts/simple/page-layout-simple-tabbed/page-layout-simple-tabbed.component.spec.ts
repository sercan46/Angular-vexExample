import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageLayoutSimpleTabbedComponent } from './page-layout-simple-tabbed.component';

describe('PageLayoutSimpleTabbedComponent', () => {
  let component: PageLayoutSimpleTabbedComponent;
  let fixture: ComponentFixture<PageLayoutSimpleTabbedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageLayoutSimpleTabbedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLayoutSimpleTabbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
