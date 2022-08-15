import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsProgressSpinnerComponent } from './components-progress-spinner.component';

describe('ComponentsProgressSpinnerComponent', () => {
  let component: ComponentsProgressSpinnerComponent;
  let fixture: ComponentFixture<ComponentsProgressSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsProgressSpinnerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsProgressSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
