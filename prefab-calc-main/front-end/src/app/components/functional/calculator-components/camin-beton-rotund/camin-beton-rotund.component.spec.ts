import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaminBetonRotundComponent } from './camin-beton-rotund.component';

describe('CaminBetonRotundComponent', () => {
  let component: CaminBetonRotundComponent;
  let fixture: ComponentFixture<CaminBetonRotundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaminBetonRotundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaminBetonRotundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
