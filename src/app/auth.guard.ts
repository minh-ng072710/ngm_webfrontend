import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './Services/authentication.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private cookies: CookieService, private authentication: AuthenticationService, private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise((resolve, reject) => {
            this.authentication.getCurrentUser()
                .then(user => {
                    resolve(true)

                },
                    err => {
                        resolve(false);
                        alert(err)
                        window.location.href = "/"

                        //nếu chưa đăng nhập chuyển sang trang login
                    })
        })
    }
}