import { Component, OnInit } from '@angular/core';
import { StateService } from '../../../../services/state.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-capac-camin-beton-rotund',
  standalone: true,
  imports: [
    ButtonModule,
    DividerModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './capac-camin-beton-rotund.component.html',
  styleUrl: './capac-camin-beton-rotund.component.scss',
})
export class CapacCaminBetonRotundComponent implements OnInit {
  resistanceOptions = [
    { name: '12.5to', value: 0 },
    { name: '25to', value: 1 },
    { name: '40to', value: 2 },
  ];
  defaultResistance = { name: '12.5to', value: 0 };

  materialNeeded: string = '0.0';

  get totalCost(): string {
    return this.state.capacCaminBetonRotundTotalCost;
  }

  set totalCost(value: string) {
    this.state.capacCaminBetonRotundTotalCost = value;
  }

  set prefabDimensions(value: any) {
    this.state.currentPrefabDimensions = value;
  }

  form: FormGroup = new FormGroup({
    diameter: new FormControl(0.1),
    height: new FormControl(0.1),
    resistanceOption: new FormControl(''),
    labor: new FormControl(5),
  });

  constructor(
    private formBuilder: FormBuilder,
    private state: StateService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      diameter: [
        0.5,
        [Validators.required, Validators.min(0.5), Validators.max(10)],
      ],
      height: [
        0.15,
        [Validators.required, Validators.min(0.15), Validators.max(10)],
      ],
      resistanceOption: [0, [Validators.required]],
      labor: [
        5,
        [Validators.required, Validators.min(0.05), Validators.max(1000)],
      ],
    });
    this.computeMaterialNeeded();
    this.computeTotalCost();
  }

  computeTotalCost(): void {
    const material = parseFloat(this.materialNeeded);
    const labor = this.form.get('labor')?.value;
    const diameter = this.form.get('diameter')?.value;
    const height = this.form.get('height')?.value;

    const volume =
      Math.PI * Math.pow(diameter / 2, 2) * height -
      Math.PI * 0.3 * 0.3 * height;

    let result = volume * 400 + material * 3.5 + labor * 25;
    result *= 1.1;

    this.totalCost = result.toFixed(2);

    this.prefabDimensions = {
      materialNeeded: material,
      labor,
      diameter,
      height,
      volume,
      resistanceOption: this.form.get('resistanceOption'),
    };
  }

  computeMaterialNeeded() {
    const resistanceOption = this.form.get('resistanceOption')?.value;
    const diameter = this.form.get('diameter')?.value;
    const height = this.form.get('height')?.value;
    let result = Math.PI * diameter * height;

    switch (resistanceOption.value) {
      case 0:
        result *= 1.44;
        break;
      case 1:
        result *= 1.88;
        break;
      case 2:
        result *= 2.44;
        break;
    }

    this.materialNeeded = result.toFixed(2);
  }

  submit() {}

  resetForm() {
    this.form.reset({
      diameter: 0.5,
      height: 0.1,
      resistanceOption: 0,
      labor: 5,
    });
    this.computeMaterialNeeded();
    this.computeTotalCost();
  }
}
