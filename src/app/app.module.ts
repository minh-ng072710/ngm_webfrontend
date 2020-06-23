//form-module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//app-routing-module
import { AppRoutingModule } from './app-routing.module';

//env-lib
import { environment } from '../environments/environment';

//angular-lib
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CookieService } from 'ngx-cookie-service';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';



//child-component
import { AppComponent } from './app.component';
import { TopbarComponent } from './Components/Blocks/Topbar/topbar.component';
import { FooterComponent } from './Components/Blocks/footer/footer.component';
import { LeftSidebarComponent } from './Components/Blocks/left-sidebar/left-sidebar.component';
import { PageTitleComponent } from './Components/Pages/page-title/page-title.component';
import { CategoryComponent } from './Components/Pages/category/category.component';
import { MainloginComponent } from './Components/mainlogin/mainlogin.component';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { IndexComponent } from './Components/index/index.component';
import { BookComponent } from './Components/Pages/book/book.component';

//all-service
import { AuthenticationService } from './Services/authentication.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import * as firebase from 'firebase';
import { UserComponent } from './Components/Pages/user/user.component';
firebase.initializeApp(environment.firebase);


@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    FooterComponent,
    LeftSidebarComponent,
    PageTitleComponent,
    CategoryComponent,
    MainloginComponent,
    HomeComponent,
    DashboardComponent,
    IndexComponent,
    BookComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule,
    DataTablesModule,
    HttpClientModule
  ],
  providers: [AuthenticationService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
