import { Injectable } from '@angular/core';
import { Category } from '../models/Category';
import { Order } from '../models/Order';
import { Client } from '../models/Client';
import { FormGroup } from '@angular/forms';
import { PrefabItem } from '../models/PrefabItem';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public BACKEND_API: string = 'http://193.201.82.157:8000/';
  // public BACKEND_API: string = 'http://127.0.0.1:8000/';
  public INTERNAL_NAMES: string[] = [
    'capac_camin_beton_rect',
    'camin_rotund',
    'capac_camin_rotund',
    'spalier',
    'camin_beton_rect',
  ];

  public isLoggedIn: boolean = false;
  public isAdmin: boolean = false;
  public username: string = '';
  public activePage: string = '';

  public prefabCategories: Category[] = [];
  public currentTheme: string = 'aura-light-theme';

  public addPrefabLastStep: boolean = false;
  public capacCaminBetonRectTotalCost: string = '0.00';
  public caminBetonRectTotalCost: string = '0.00';
  public caminBetonRotundTotalCost: string = '0.00';
  public capacCaminBetonRotundTotalCost: string = '0.00';
  public spalierTotalCost: string = '0.00';

  public newItemCategory: string = '';
  public newItemName: string = '';
  public newItemDescription: string = '';
  public newItemStock: number = 0;
  public newItemPrice: number = 0;
  public newItemThumbnail: string = '';
  public newItemProductCode: string = '';
  public isCategorySet: boolean = false;
  public thumbnailUploaded: boolean = false;
  public addPrefabThirdOption: string = 'default';
  public currentPrefabDimensions: any = {};

  public currentOrder: Order = {
    items: [],
    total: 0.0,
    status: 'Așteptare',
    address: '',
    subtotal: 0.0,
    shipping: 0.0,
    discount: 0.0,
  };
  public currentOrderClient: Client = { id: undefined };
  public isCurrentOrderEditMode: boolean = false;

  public newClient: Client = {};
  public newClientActive: number = -1;
  public addClientForm: FormGroup | null = null;

  public singleProduct: PrefabItem | null = null;
}
