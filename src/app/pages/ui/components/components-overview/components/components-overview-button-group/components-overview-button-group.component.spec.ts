import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsOverviewButtonGroupComponent } from './components-overview-button-group.component';

describe('ComponentsOverviewButtonGroupComponent', () => {
  let component: ComponentsOverviewButtonGroupComponent;
  let fixture: ComponentFixture<ComponentsOverviewButtonGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsOverviewButtonGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsOverviewButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
