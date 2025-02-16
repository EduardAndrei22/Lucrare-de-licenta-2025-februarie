import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrefabComponent } from './add-prefab.component';

describe('AddPrefabComponent', () => {
  let component: AddPrefabComponent;
  let fixture: ComponentFixture<AddPrefabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrefabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPrefabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
