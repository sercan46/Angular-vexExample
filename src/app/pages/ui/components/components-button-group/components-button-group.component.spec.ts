import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsButtonGroupComponent } from './components-button-group.component';

describe('ComponentsButtonGroupComponent', () => {
  let component: ComponentsButtonGroupComponent;
  let fixture: ComponentFixture<ComponentsButtonGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsButtonGroupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
