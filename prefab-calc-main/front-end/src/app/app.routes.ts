import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { CalculatorPageComponent } from './components/calculator-page/calculator-page.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { OrderPageComponent } from './components/order-page/order-page.component';
import { NewOrderPageComponent } from './components/new-order-page/new-order-page.component';
import { SingleProductPageComponent } from './components/functional/single-product-page/single-product-page.component';
import { StatsPageComponent } from './components/stats-page/stats-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'admin', component: AdminPageComponent },
  { path: 'calculator', component: CalculatorPageComponent },
  { path: 'products', component: ProductPageComponent },
  { path: 'orders', component: OrderPageComponent },
  { path: 'new-order', component: NewOrderPageComponent },
  { path: 'product', component: SingleProductPageComponent },
  { path: 'stats', component: StatsPageComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
