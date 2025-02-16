import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaminBetonRectComponent } from './camin-beton-rect.component';

describe('CaminBetonRectComponent', () => {
  let component: CaminBetonRectComponent;
  let fixture: ComponentFixture<CaminBetonRectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaminBetonRectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaminBetonRectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
