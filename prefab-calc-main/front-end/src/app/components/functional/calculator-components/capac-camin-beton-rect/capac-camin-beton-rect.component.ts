import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { StateService } from '../../../../services/state.service';

@Component({
  selector: 'app-capac-camin-beton-rect',
  standalone: true,
  imports: [
    DividerModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
  ],
  templateUrl: './capac-camin-beton-rect.component.html',
  styleUrl: './capac-camin-beton-rect.component.scss',
})
export class CapacCaminBetonRectComponent implements OnInit {
  resistanceOptions = [
    { name: '12.5to', value: 0 },
    { name: '25to', value: 1 },
    { name: '40to', value: 2 },
  ];
  defaultResistance = { name: '12.5to', value: 0 };

  materialNeeded: string = '0.0';

  get totalCost(): string {
    return this.state.capacCaminBetonRectTotalCost;
  }

  set totalCost(value: string) {
    this.state.capacCaminBetonRectTotalCost = value;
  }

  set prefabDimensions(value: any) {
    this.state.currentPrefabDimensions = value;
  }

  form: FormGroup = new FormGroup({
    length: new FormControl(''),
    width: new FormControl(''),
    height: new FormControl(''),
    resistanceOption: new FormControl(''),
    labor: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private state: StateService,
  ) {}

  ngOnInit(): void {
    this.state.activePage = 'calculator';
    this.form = this.formBuilder.group({
      length: [
        0.1,
        [Validators.required, Validators.min(0.1), Validators.max(100)],
      ],
      width: [
        0.1,
        [Validators.required, Validators.min(0.1), Validators.max(100)],
      ],
      height: [
        0.15,
        [Validators.required, Validators.min(0.1), Validators.max(100)],
      ],
      resistanceOption: [{ name: '12.5to', value: 0 }, [Validators.required]],
      labor: [
        5,
        [Validators.required, Validators.min(0.05), Validators.max(1000)],
      ],
    });
    this.computeTotalCost();
  }

  computeMaterialNeeded(): void {
    const resistanceOption = this.form.get('resistanceOption')?.value;
    const length = this.form.get('length')?.value;
    const width = this.form.get('width')?.value;
    let result = (length - 6) * (width - 6);

    switch (resistanceOption.value) {
      case 0:
        this.materialNeeded = Math.round(result * 4.4).toFixed(2);
        return;
      case 1:
        this.materialNeeded = Math.round(result * 8.8).toFixed(2);
        return;
      case 2:
        this.materialNeeded = Math.round(result * 14).toFixed(2);
        return;
      default:
        this.materialNeeded = '0.00';
    }
  }

  submit(): void {}

  computeTotalCost() {
    const resistanceOption = this.form.get('resistanceOption')?.value;
    const length = this.form.get('length')?.value;
    const width = this.form.get('width')?.value;
    const height = this.form.get('height')?.value;
    const labor = this.form.get('labor')?.value;

    const volume = length * width * height - Math.PI * 0.3 * 0.3 * height;

    let totalCost =
      volume * 400 + parseFloat(this.materialNeeded) * 3.5 + labor * 25;
    this.totalCost = Math.round(totalCost * 1.1).toFixed(2);

    this.prefabDimensions = {
      resistanceOption,
      length,
      width,
      height,
      labor,
      materialNeeded: this.materialNeeded,
      volume,
    };
  }

  resetForm(): void {
    this.form.reset({
      length: 0.1,
      width: 0.1,
      height: 0.1,
      resistanceOption: { name: '12.5to', value: 0 },
      labor: 5,
    });
  }
}
