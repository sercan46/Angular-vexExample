import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageLayoutDemoComponent } from './page-layout-demo.component';

describe('PageLayoutDemoComponent', () => {
  let component: PageLayoutDemoComponent;
  let fixture: ComponentFixture<PageLayoutDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageLayoutDemoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLayoutDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
