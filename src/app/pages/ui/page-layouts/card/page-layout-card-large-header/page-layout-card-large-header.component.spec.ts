import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageLayoutCardLargeHeaderComponent } from './page-layout-card-large-header.component';

describe('PageLayoutCardLargeHeaderComponent', () => {
  let component: PageLayoutCardLargeHeaderComponent;
  let fixture: ComponentFixture<PageLayoutCardLargeHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageLayoutCardLargeHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLayoutCardLargeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
