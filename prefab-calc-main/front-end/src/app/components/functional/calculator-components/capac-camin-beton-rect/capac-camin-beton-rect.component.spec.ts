import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacCaminBetonRectComponent } from './capac-camin-beton-rect.component';

describe('CapacCaminBetonRectComponent', () => {
  let component: CapacCaminBetonRectComponent;
  let fixture: ComponentFixture<CapacCaminBetonRectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapacCaminBetonRectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapacCaminBetonRectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
