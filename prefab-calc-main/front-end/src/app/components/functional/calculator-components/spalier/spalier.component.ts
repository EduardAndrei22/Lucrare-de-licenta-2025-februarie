import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { StateService } from '../../../../services/state.service';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-spalier',
  standalone: true,
  imports: [
    DividerModule,
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './spalier.component.html',
  styleUrl: './spalier.component.scss',
})
export class SpalierComponent implements OnInit {
  dimensionOptions = [
    { name: '7 x 8', value: 0 },
    { name: '9 x 9.5', value: 1 },
  ];

  defaultDimension = { name: '7 x 8', value: 0 };

  form: FormGroup = new FormGroup({
    length: new FormControl(0.1),
    labor: new FormControl(5),
    dimensionOption: new FormControl(''),
  });

  materialNeeded: string = '0.00';

  get totalCost(): string {
    return this.state.spalierTotalCost;
  }

  set totalCost(value: string) {
    this.state.spalierTotalCost = value;
  }

  set prefabDimensions(value: any) {
    this.state.currentPrefabDimensions = value;
  }

  constructor(
    private formBuilder: FormBuilder,
    private state: StateService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      length: [0.1],
      labor: [5],
      dimensionOption: [''],
    });

    this.computeMaterialNeeded();
    this.computeTotalCost();
  }

  submit() {}

  computeMaterialNeeded() {
    const length = this.form.get('length')!.value;

    this.materialNeeded = (length * 4).toFixed(2);
    this.computeTotalCost();
  }

  computeTotalCost() {
    const length = this.form.get('length')!.value;
    const labor = this.form.get('labor')!.value;
    const dimensionOption = this.form.get('dimensionOption')!.value.value;

    let volume =
      dimensionOption === 0 ? 0.07 * 0.08 * length : 0.09 * 0.095 * length;
    let result = volume * 400 + parseFloat(this.materialNeeded) + labor * 25;
    result *= 1.1;

    this.totalCost = result.toFixed(2);

    this.prefabDimensions = {
      materialNeeded: this.materialNeeded,
      volume,
      length,
      labor,
      dimensionOption,
    };
  }

  resetForm() {
    this.form.reset({
      length: 0.1,
      labor: 5,
      dimensionOption: '',
    });
    this.computeMaterialNeeded();
    this.computeTotalCost();
  }
}
