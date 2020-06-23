import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    userData: Observable<firebase.User>;
    constructor(private angularFireAuth: AngularFireAuth) {
        this.userData = angularFireAuth.authState;
    }
    SignUp(email: string) {
        let password = '123456'
        this.angularFireAuth
            .createUserWithEmailAndPassword(email, password)
            .then(res => {
                window.alert('Đăng kí thành công!');
                // window.location.href='/home'
                return res
            })
            .catch(error => {
                window.alert(error.message);
            });
    }
    /* Sign out */
    SignOut() {
        this.angularFireAuth
            .signOut();
        window.alert("Đăng xuất thành công!")

        window.location.href = "/"
    }
    SignIn(email: string, password: string) {
        this.angularFireAuth
            .signInWithEmailAndPassword(email, password)
            .then(res => {
                window.location.href = '/home'
            })
            .catch(err => {
                window.alert(err.message);
            });
    }
    doGoogleLogin() {
        return new Promise<any>((resolve, reject) => {
            let provider = new firebase.auth.GoogleAuthProvider()
            provider.addScope('profile');
            provider.addScope('email');
            this.angularFireAuth
                .signInWithPopup(provider)
                .then(res => {
                    resolve(res);
                    window.location.href = "/home/category" //Hàm resolve returns a Promise object that is resolved with a given value
                }, err => {
                    console.log(err);
                    reject(err);
                })
        })
    }
    getCurrentUser() {
        return new Promise<any>((resolve, reject) => {
            var user = firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // this.cookies.set("email", user.email)
                    resolve(user);
                } else {
                    reject('Mày chưa đăng kí hộ khẩu mà muốn vào nhà tao à!! Bấm cmn cút!');
                }
            })
        })
    }
}