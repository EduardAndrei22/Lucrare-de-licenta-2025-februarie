import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpalierComponent } from './spalier.component';

describe('SpalierComponent', () => {
  let component: SpalierComponent;
  let fixture: ComponentFixture<SpalierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpalierComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpalierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
