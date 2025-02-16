import { Component, OnInit } from '@angular/core';
import { StateService } from '../../../../services/state.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-camin-beton-rect',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DividerModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
  ],
  templateUrl: './camin-beton-rect.component.html',
  styleUrl: './camin-beton-rect.component.scss',
})
export class CaminBetonRectComponent implements OnInit {
  armatureOptions = [
    { name: 'Nearmat', value: 0 },
    { name: 'Ușor armat', value: 1 },
    { name: 'Dublu armat', value: 2 },
  ];

  materialNeeded: string = '0.00';
  get totalCost(): string {
    return this.state.caminBetonRectTotalCost;
  }

  set totalCost(value: string) {
    this.state.caminBetonRectTotalCost = value;
  }

  set prefabDimensions(value: any) {
    this.state.currentPrefabDimensions = value;
  }

  constructor(
    private formBuilder: FormBuilder,
    private state: StateService,
  ) {}

  form: FormGroup = new FormGroup({
    length: new FormControl(''),
    width: new FormControl(''),
    height: new FormControl(''),
    thickness: new FormControl(''),
    armature: new FormControl(''),
    withValve: new FormControl(''),
    pvcPipeNumber: new FormControl(''),
    labor: new FormControl(''),
  });

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      length: [
        0.1,
        [Validators.required, Validators.min(0.1), Validators.max(10)],
      ],
      width: [
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
      pvcPipeNumber: [''],
      labor: [
        5,
        [Validators.required, Validators.min(0.05), Validators.max(1000)],
      ],
    });
    this.computeTotalCost();
  }

  submit(): void {}

  computeMaterialNeeded(): void {
    const armature = this.form.get('armature')?.value;
    const length = this.form.get('length')?.value;
    const width = this.form.get('width')?.value;
    const height = this.form.get('height')?.value;

    switch (armature.value) {
      case 0:
        this.materialNeeded = '0.00';
        return;
      case 1:
        let resultCase1 =
          2 * ((length - 0.05) * height) + 2 * ((width - 0.05) * height) * 4.4;
        this.materialNeeded = (Math.round(resultCase1 * 100) / 100).toFixed(3);
        return;
      case 2:
        let resultCase2 =
          2 * ((length - 0.05) * height) + 2 * ((width - 0.05) * height) * 8.8;
        this.materialNeeded = (Math.round(resultCase2 * 100) / 100).toFixed(3);
        return;
      default:
        this.materialNeeded = '0.00';
        return;
    }
  }

  computeTotalCost() {
    const armature = this.form.get('armature')?.value;
    const length = this.form.get('length')?.value;
    const width = this.form.get('width')?.value;
    const height = this.form.get('height')?.value;
    const thickness = this.form.get('thickness')?.value;
    const withValve = this.form.get('withValve')?.value;
    const pvcPipeNumber = this.form.get('pvcPipeNumber')?.value;
    const labor = this.form.get('labor')?.value;

    let result = 0;
    let volume =
      (length + thickness) * (width + thickness) * height -
      length * width * height;

    result += volume * 500;
    result += parseFloat(this.materialNeeded) * 3.5;

    if (withValve[0]) {
      result += pvcPipeNumber * thickness * 10;
    }

    result += labor * 25;
    result *= 1.1;

    this.totalCost = (Math.round(result * 100) / 100).toFixed(2);
    this.prefabDimensions = {
      armature,
      length,
      width,
      height,
      thickness,
      withValve,
      pvcPipeNumber,
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
      thickness: 0.1,
      armature: '',
      withValve: false,
      pvcPipeNumber: '',
      labor: 5,
    });
    this.computeTotalCost();
  }
}
