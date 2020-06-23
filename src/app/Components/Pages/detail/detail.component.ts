import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/user';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @Input() user: User;
  users: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsersList()
  }
  getUsersList() {
    this.userService.getUserList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(users => {
      this.users = users;
    });
  }
  deleteCustomers() {
    this.userService.deleteAll();
  }
  updateActive(isActive: boolean) {
    this.userService
      .updateUser(this.user.key, { active: isActive })
      .catch(err => {
        console.log("Lỗi cmnr: " + err)
      })

  }
  deleteUser() {
    console.log("key nè" + this.user.key)
    this.userService
      .deleteUser(this.user.key)
      .catch(err => console.log(err))

  }
}
