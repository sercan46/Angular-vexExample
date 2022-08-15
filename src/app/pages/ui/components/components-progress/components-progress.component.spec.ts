import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsProgressComponent } from './components-progress.component';

describe('ComponentsProgressComponent', () => {
  let component: ComponentsProgressComponent;
  let fixture: ComponentFixture<ComponentsProgressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsProgressComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
