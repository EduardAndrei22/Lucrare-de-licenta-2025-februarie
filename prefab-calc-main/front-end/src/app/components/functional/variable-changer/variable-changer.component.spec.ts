import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableChangerComponent } from './variable-changer.component';

describe('VariableChangerComponent', () => {
  let component: VariableChangerComponent;
  let fixture: ComponentFixture<VariableChangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariableChangerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariableChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
