import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {ModalModule} from 'ngx-bootstrap/modal';
import {LoadingModule} from 'ngx-loading';
import {SocketIoModule, SocketIoConfig} from 'ng-socket-io';

import {ClothService} from './services/ClothService';
import {CartService} from './services/CartService';
import {UserService} from './services/UserService';
import {BranchService} from './services/BranchService';
import {ChatService} from './services/ChatService';

import {OnlyAdminUsersGuard} from './guards/OnlyAdminUsersGuard';
import {OnlyLoggedInUsersGuard} from './guards/OnlyLoggedInUsersGuard';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {StoreComponent} from './store/store.component';
import {FilterComponent} from './store/filter/filter.component';
import {ClothesListComponent} from './store/clothes-list/clothes-list.component';
import {ClothComponent} from './shared-components/cloth/cloth.component';
import {AboutUsComponent} from './about-us/about-us.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {CartComponent} from './cart/cart.component';
import {HomeComponent} from './home/home.component';
import {CarouselComponent} from './home/carousel/carousel.component';
import {ProfileComponent} from './profile/profile.component';
import {AdminSpaceComponent} from './admin-space/admin-space.component';
import {ProvierTableComponent} from './admin-space/provier-table/provier-table.component';
import {ClothDataComponent} from './admin-space/cloth-data/cloth-data.component';
import {LoginComponent} from './login/login.component';
import {AlertComponent} from './shared-components/alert/alert.component';
import {ModalComponent} from './shared-components/modal/modal.component';
import {BranchDataComponent} from './admin-space/branch-data/branch-data.component';
import {BranchTableComponent} from './admin-space/branch-table/branch-table.component';
import {ClothInfoComponent} from './store/cloth-info/cloth-info.component';
import {ChatComponent} from './store/cloth-info/chat/chat.component';
import {StatisticsComponent} from './statistics/statistics.component';
import { EvaluationComponent } from './admin-space/evaluation/evaluation.component';

const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}};

const appRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'store', component: StoreComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cart', component: CartComponent, canActivate: [OnlyLoggedInUsersGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [OnlyLoggedInUsersGuard]},
  {path: 'admin-space', component: AdminSpaceComponent, canActivate: [OnlyAdminUsersGuard]},
  {path: 'statistics', component: StatisticsComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StoreComponent,
    FilterComponent,
    ClothesListComponent,
    ClothComponent,
    AboutUsComponent,
    PageNotFoundComponent,
    CartComponent,
    HomeComponent,
    CarouselComponent,
    ProfileComponent,
    AdminSpaceComponent,
    ProvierTableComponent,
    ClothDataComponent,
    LoginComponent,
    AlertComponent,
    ModalComponent,
    BranchDataComponent,
    BranchTableComponent,
    ClothInfoComponent,
    ChatComponent,
    StatisticsComponent,
    EvaluationComponent
  ],
  imports: [
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    LoadingModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [UserService, ClothService, CartService, BranchService, ChatService, OnlyLoggedInUsersGuard, OnlyAdminUsersGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
