import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/Services/authentication.service';
@Component({
  selector: 'app-mainlogin',
  templateUrl: './mainlogin.component.html',
  styleUrls: ['./mainlogin.component.css']
})
export class MainloginComponent implements OnInit {
  angForm: FormGroup;

  constructor(private fb: FormBuilder, public authenticationService: AuthenticationService) { }

  ngOnInit(): void {


  }
  createForm() {
    this.angForm = this.fb.group({
      UserName: ['', Validators.required],
      PassWord: ['', Validators.required],

    });
  }
  SignUp(username) {
    this.authenticationService.SignUp(username);
  }
  Login(username, password) {
    this.authenticationService.SignIn(username, password);
  }

  tryGoogleLogin() {
    this.authenticationService.doGoogleLogin()
      .then(res => {
        // window.location.href="/home/dashboard"
      })
  }


}
