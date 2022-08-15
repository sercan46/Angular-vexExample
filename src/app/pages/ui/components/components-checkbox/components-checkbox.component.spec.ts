import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsCheckboxComponent } from './components-checkbox.component';

describe('ComponentsCheckboxComponent', () => {
  let component: ComponentsCheckboxComponent;
  let fixture: ComponentFixture<ComponentsCheckboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsCheckboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
