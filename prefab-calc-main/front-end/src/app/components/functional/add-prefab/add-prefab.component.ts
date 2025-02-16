import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MessageService, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { StepperModule } from 'primeng/stepper';
import { PrefabitemService } from '../../../services/prefabitem.service';
import { ToastModule } from 'primeng/toast';
import { CaminBetonRectComponent } from '../calculator-components/camin-beton-rect/camin-beton-rect.component';
import { CapacCaminBetonRectComponent } from '../calculator-components/capac-camin-beton-rect/capac-camin-beton-rect.component';
import { StateService } from '../../../services/state.service';
import { FileUploadModule } from 'primeng/fileupload';
import { Image, ImageModule } from 'primeng/image';
import { NgIf } from '@angular/common';
import { CaminBetonRotundComponent } from '../calculator-components/camin-beton-rotund/camin-beton-rotund.component';
import { CapacCaminBetonRotundComponent } from '../calculator-components/capac-camin-beton-rotund/capac-camin-beton-rotund.component';
import { SpalierComponent } from '../calculator-components/spalier/spalier.component';

@Component({
  selector: 'app-add-prefab',
  standalone: true,
  imports: [
    ButtonModule,
    DividerModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,
    PaginatorModule,
    RippleModule,
    SharedModule,
    StepperModule,
    ToastModule,
    CaminBetonRectComponent,
    CapacCaminBetonRectComponent,
    FileUploadModule,
    ImageModule,
    CaminBetonRotundComponent,
    CapacCaminBetonRotundComponent,
    SpalierComponent,
  ],
  providers: [MessageService],
  templateUrl: './add-prefab.component.html',
  styleUrl: './add-prefab.component.scss',
})
export class AddPrefabComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private prefabService: PrefabitemService,
    private state: StateService,
  ) {}

  get thirdOption(): string {
    return this.state.addPrefabThirdOption;
  }

  set thirdOption(value: string) {
    this.state.addPrefabThirdOption = value;
  }

  ngOnInit(): void {
    this.thirdOption = 'default';
    this.resetNewItem();
    this.prefabService.fetchCategories().subscribe((categories: any) => {
      for (const category of categories) {
        this.categories.push({ label: category.name, value: category.id });
      }
    });
  }

  @ViewChild('newPrefabImage') newPrefabImage!: Image;

  categories: any[] = [];
  prefabImageVisible: boolean = false;

  get newItemCategory(): string {
    return this.state.newItemCategory;
  }

  set newItemCategory(value: string) {
    this.state.newItemCategory = value;
  }

  get newItemName(): string {
    return this.state.newItemName;
  }

  set newItemName(value: string) {
    this.state.newItemName = value;
  }

  get newItemDescription(): string {
    return this.state.newItemDescription;
  }

  set newItemDescription(value: string) {
    this.state.newItemDescription = value;
  }

  get newItemStock(): number {
    return this.state.newItemStock;
  }

  set newItemStock(value: number) {
    this.state.newItemStock = value;
  }

  get thumbnailUploaded(): boolean {
    return this.state.thumbnailUploaded;
  }

  set thumbnailUploaded(value: boolean) {
    this.state.thumbnailUploaded = value;
  }

  get newItemThumbnail(): string {
    return this.state.newItemThumbnail;
  }

  set newItemThumbnail(value: string) {
    this.state.newItemThumbnail = value;
  }

  get newItemProductCode(): string {
    return this.state.newItemProductCode;
  }

  set newItemProductCode(value: string) {
    this.state.newItemProductCode = value;
  }

  get newItemPrice(): number {
    return this.state.newItemPrice;
  }

  set newItemPrice(value: number) {
    this.state.newItemPrice = value;
  }

  resetNewItem(): void {
    this.newItemName = '';
    this.newItemDescription = '';
    this.newItemStock = 0;
    this.newItemProductCode = '';
    if (this.state.isCategorySet) {
      this.setThirdStep();
      return;
    }
    this.newItemCategory = '';
    this.newItemPrice = 0;
  }

  addCategoryToItem($event: any) {
    this.newItemCategory = $event.value;
    this.setThirdStep();
  }

  validateCategory(callback: any): void {
    if (
      this.newItemCategory === undefined ||
      this.newItemCategory === '' ||
      this.newItemCategory === null
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Category is required',
      });
      return;
    }
    callback.emit();
  }

  validateDetails(callback: any): void {
    let nameOk = false;
    if (
      this.newItemName === undefined ||
      this.newItemName === '' ||
      this.newItemName === null
    )
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Name is required',
      });
    else nameOk = true;

    let descriptionOk = false;
    if (
      this.newItemDescription === undefined ||
      this.newItemDescription === '' ||
      this.newItemDescription === null
    )
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Description is required',
      });
    else descriptionOk = true;

    let stockOk = false;
    if (this.newItemStock === undefined || this.newItemStock === null)
      this.newItemStock = 0;
    else stockOk = true;

    if (nameOk && descriptionOk && stockOk) {
      callback.emit();
      this.state.addPrefabLastStep = true;
    }
  }

  setThirdStep(): void {
    switch (this.newItemCategory) {
      case 'Camine rectangulare':
        this.thirdOption = 'camin_rect';
        break;
      case 'Capace de camin rectangulare':
        this.thirdOption = 'capac_camin_rect';
        break;
      case 'Camine rotunde':
        this.thirdOption = 'camin_rotund';
        break;
      case 'Capace de camin rotunde':
        this.thirdOption = 'capac_camin_rotund';
        break;
      case 'Spalieri':
        this.thirdOption = 'spalier';
        break;
      default:
        this.thirdOption = 'default';
        break;
    }
  }

  setSaveInactive(prevCallback: any) {
    this.state.addPrefabLastStep = false;
    prevCallback.emit();
  }

  uploadFile($event: any) {
    this.prefabImageVisible = false;
    setTimeout(() => {
      this.thumbnailUploaded = true;
      this.newItemThumbnail = $event.originalEvent.body.temp_path;
      this.newPrefabImage.src = $event.originalEvent.body.temp_path;
      this.prefabImageVisible = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Thumbnail uploaded',
      });
    }, 200);
  }
}
