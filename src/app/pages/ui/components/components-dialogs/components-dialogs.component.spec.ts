import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsDialogsComponent } from './components-dialogs.component';

describe('ComponentsDialogsComponent', () => {
  let component: ComponentsDialogsComponent;
  let fixture: ComponentFixture<ComponentsDialogsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsDialogsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
