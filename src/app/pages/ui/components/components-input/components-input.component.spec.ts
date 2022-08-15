import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsInputComponent } from './components-input.component';

describe('ComponentsInputComponent', () => {
  let component: ComponentsInputComponent;
  let fixture: ComponentFixture<ComponentsInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
