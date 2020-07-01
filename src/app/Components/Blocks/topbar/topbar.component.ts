import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { UserService } from 'src/app/Services/User.service';
import User from 'src/app/Model/User';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  displayName: string = "";
  User: User;
  ListUser;
  Image: string
  constructor(private auth: AuthenticationService, private US: UserService) { }

  ngOnInit(): void {
    this.auth.getCurrentUser().then(
      user => {
        this.displayName = user.displayName != null ? user.displayName : user.email
        this.User = new User();

        this.US.getalluser().subscribe(data => {
          this.ListUser = Object.assign(data);
          this.ListUser.forEach(item_1 => {
            if (item_1.Email == user.email) {
              this.Image = "http://localhost:9000/upload/" + item_1.Image_URL
            }
          })

        })
      });

  }

  Logout() {
    this.auth.SignOut();
  }
}
