import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComponentsListsComponent } from './components-lists.component';

describe('ComponentsListsComponent', () => {
  let component: ComponentsListsComponent;
  let fixture: ComponentFixture<ComponentsListsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentsListsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
