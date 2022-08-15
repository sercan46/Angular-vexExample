import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsButtonsComponent } from './components-buttons.component';

describe('ComponentsButtonsComponent', () => {
  let component: ComponentsButtonsComponent;
  let fixture: ComponentFixture<ComponentsButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsButtonsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
