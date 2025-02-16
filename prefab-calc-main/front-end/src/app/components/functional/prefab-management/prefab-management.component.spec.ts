import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefabManagementComponent } from './prefab-management.component';

describe('PrefabManagementComponent', () => {
  let component: PrefabManagementComponent;
  let fixture: ComponentFixture<PrefabManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrefabManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrefabManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
