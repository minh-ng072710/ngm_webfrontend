import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthenticationService } from 'src/app/Services/authentication.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  displayName: string = "";
  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.auth.getCurrentUser().then(
      user => this.displayName = user.displayName != null ? user.displayName : user.email);
  }

  Logout() {
    this.auth.SignOut();

  }
}
