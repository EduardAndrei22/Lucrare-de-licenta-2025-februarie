import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacCaminBetonRotundComponent } from './capac-camin-beton-rotund.component';

describe('CapacCaminBetonRotundComponent', () => {
  let component: CapacCaminBetonRotundComponent;
  let fixture: ComponentFixture<CapacCaminBetonRotundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapacCaminBetonRotundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapacCaminBetonRotundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
