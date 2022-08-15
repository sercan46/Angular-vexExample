import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsRadioComponent } from './components-radio.component';

describe('ComponentsRadioComponent', () => {
  let component: ComponentsRadioComponent;
  let fixture: ComponentFixture<ComponentsRadioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsRadioComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
