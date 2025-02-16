import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StateService } from '../../../../services/state.service';

@Component({
  selector: 'app-camin-beton-rotund',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './camin-beton-rotund.component.html',
  styleUrl: './camin-beton-rotund.component.scss',
})
export class CaminBetonRotundComponent implements OnInit {
  materialNeeded: string = '0.00';
  armatureOptions = [
    { name: 'Nearmat', value: 0 },
    { name: 'Ușor armat', value: 1 },
    { name: 'Dublu armat', value: 2 },
  ];

  get totalCost(): string {
    return this.state.caminBetonRotundTotalCost;
  }

  set totalCost(value: string) {
    this.state.caminBetonRotundTotalCost = value;
  }

  set prefabDimensions(value: any) {
    this.state.currentPrefabDimensions = value;
  }

  form: FormGroup = new FormGroup({
    diameter: new FormControl(''),
    height: new FormControl(''),
    thickness: new FormControl(''),
    armature: new FormControl(''),
    withValve: new FormControl(''),
    pvcPipeNumber: new FormControl(''),
    labor: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private state: StateService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      diameter: [
        0.1,
        [Validators.required, Validators.min(0.1), Validators.max(10)],
      ],
      height: [
        0.1,
        [Validators.required, Validators.min(0.1), Validators.max(10)],
      ],
      thickness: [
        0.1,
        [Validators.required, Validators.min(0.1), Validators.max(0.5)],
      ],
      armature: [''],
      withValve: [false],
      pvcPipeNumber: [0],
      labor: [
        5,
        [Validators.required, Validators.min(0.05), Validators.max(1000)],
      ],
    });

    this.computeTotalCost();
  }

  computeTotalCost() {
    const diameter = this.form.get('diameter')?.value;
    const height = this.form.get('height')?.value;
    const thickness = this.form.get('thickness')?.value;
    const labor = this.form.get('labor')?.value;
    const withValve = this.form.get('withValve')?.value;
    const pvcPipeNumber = this.form.get('pvcPipeNumber')?.value;

    let result = 0.0;
    const volume =
      Math.PI *
      (Math.pow(diameter, 2) -
        (Math.PI * Math.pow(diameter - thickness, 2)) / 4) *
      height;

    if (withValve[0]) {
      result += pvcPipeNumber * thickness * 10;
    }
    result += volume * 400;
    result += labor * 25;
    result += parseFloat(this.materialNeeded) * 3.5;
    result *= 1.1;

    this.totalCost = (Math.round(result * 100) / 100).toFixed(2);

    this.prefabDimensions = {
      diameter,
      height,
      thickness,
      labor,
      withValve,
      pvcPipeNumber,
      volume,
      armature: this.form.get('armature')?.value,
      materialNeeded: this.materialNeeded,
    };
  }

  submit() {}

  computeMaterialNeeded(): void {
    const diameter = this.form.get('diameter')?.value;
    const height = this.form.get('height')?.value;
    const armature = this.form.get('armature')?.value;

    switch (armature.value) {
      case 0:
        this.materialNeeded = '0.00';
        return;
      case 1:
        let resultCase1 = Math.PI * (diameter - 0.05) * (height - 0.05) * 4.4;
        this.materialNeeded = (Math.round(resultCase1 * 100) / 100).toFixed(2);
        return;
      case 2:
        let resultCase2 = Math.PI * (diameter - 0.05) * (height - 0.05) * 8.8;
        this.materialNeeded = (Math.round(resultCase2 * 100) / 100).toFixed(2);
        return;
    }
  }

  resetForm() {
    this.form.reset({
      diameter: 0.1,
      height: 0.1,
      thickness: 0.1,
      armature: '',
      withValve: false,
      pvcPipeNumber: '',
      labor: 5,
    });
    this.materialNeeded = '0.00';
    this.totalCost = '0.00';
  }
}
