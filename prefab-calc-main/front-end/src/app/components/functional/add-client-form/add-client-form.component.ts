import { Component, OnInit } from '@angular/core';
import { StateService } from '../../../services/state.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-add-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './add-client-form.component.html',
  styleUrl: './add-client-form.component.scss',
})
export class AddClientFormComponent implements OnInit {
  constructor(
    private state: StateService,
    private formBuilder: FormBuilder,
  ) {}

  get addClientForm() {
    return this.state.addClientForm;
  }

  set addClientForm(value: FormGroup | null) {
    this.state.addClientForm = value;
  }

  ngOnInit(): void {
    this.addClientForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: [''],
      phone: [''],
      email: [''],
      bank: [''],
      iban: [''],
      cui: ['', Validators.required],
      reg: ['', Validators.required],
    });
  }
}
