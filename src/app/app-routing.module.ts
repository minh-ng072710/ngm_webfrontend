import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'

import { DetailComponent } from './Components/Pages/detail/detail.component';
import { CategoryComponent } from './Components/Pages/category/category.component';
import { MainloginComponent } from './Components/mainlogin/mainlogin.component';
import { IndexComponent } from './Components/index/index.component';
import { AuthGuard } from './auth.guard';
import { BookComponent } from './Components/Pages/book/book.component';
import { UserComponent } from './Components/Pages/user/user.component';

const routesConfig: Routes = [

  {
    path: '',
    component: MainloginComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'home',
    component: IndexComponent,

    children: [
      {
        path: 'book',
        component: BookComponent

      },
      {
        path: 'user',
        component: UserComponent

      },
      {
        path: 'cate',
        component: CategoryComponent

      }

    ]
  },
  // { path: 'detail', component: DetailComponent },
  // { path: 'login', component: MainloginComponent },



];

@NgModule({
  declarations: [
    DetailComponent,
  ],
  imports: [
    RouterModule.forRoot(routesConfig),
    CommonModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
