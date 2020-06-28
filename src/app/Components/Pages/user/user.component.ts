import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import User from '../../../Model/User';
import * as firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private userCollection: AngularFirestoreCollection<User>;
  ListUser;
  Model;
  user;
  CheckSua: boolean = false;
  checkhinh: boolean = false;
  Submitted: boolean = false;
  CheckTao: boolean = true;
  NgForm: FormGroup;
  ViTri = ["Nhân viên tư Vấn", "Kế toán", "Quản lý", "Nhân viên bán thời gian"]
  images;
  url = "";
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private readonly afs: AngularFirestore, private AngularAuth: AngularFireAuth, private http: HttpClient) {
    this.CreateForm();
    this.userCollection = this.afs.collection<User>("User");
  }
  formatTime() {
    let year, month, date, hours, minutes, seconds;
    var dt = new Date();
    var dt_after;
    year = dt.getFullYear().toString().padStart(4, '0')
    month = (dt.getMonth() + 1).toString().padStart(2, '0')
    date = dt.getDate().toString().padStart(2, '0')
    hours = dt.getHours().toString().padStart(2, '0')
    minutes = dt.getMinutes().toString().padStart(2, '0')
    seconds = dt.getSeconds().toString().padStart(2, '0')
    dt_after = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
    return dt_after;
  }

  ngOnInit() {
    this.ListUser = new Array<User>();
    this.userCollection.snapshotChanges().subscribe(data => {
      let list = Object.assign(data)
      list.forEach(element => {
        console.log(element)
        this.ListUser.push(element.payload.doc.data())
      })
      console.log(this.ListUser)
      this.innitdatable(this.ListUser)
    })
    this.user = new User();
  }
  CreateForm() {
    this.NgForm = this.fb.group({
      AccFullName: ['', Validators.required],
      Email: ['', Validators.required],
      Address: ['', Validators.required],
      Gender: ['', Validators.required],
      DateOfBirth: ['', Validators.required],
      Position: ['', Validators.required],
      Img_URL: ['', Validators.required]
    });
  }
  get f() { return this.NgForm.controls; }
  selectImage(event) {
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result
      }
      if (event.target.files.length > 0) {
        this.checkhinh = true;
        const file = event.target.files[0];
        this.images = file;

      }
    }
  }
  UpdateDatable(data) {
    console.log(data)

    $('#datatables').DataTable()
      .clear()
      .rows.add(data)
      .draw();
  }
  GetUser() {
    this.userCollection.snapshotChanges().subscribe(data => {
      this.ListUser = [];
      let list = Object.assign(data)
      list.forEach(element => {
        this.ListUser.push(element.payload.doc.data())
      })
      console.log(this.ListUser)
      this.UpdateDatable(this.ListUser)
    })
  }
  async Create_User() {
    this.Submitted = true;
    const formdata = new FormData();
    formdata.append('file', this.images);
    var time = this.formatTime();
    // stop here if form is invali
    await this.http.post<any>("http://localhost:9000/api/file", formdata).subscribe(
      async res => {
        if (this.NgForm.invalid) {
          alert("return")
          return;
        } else {
          alert("2")
          let email = this.user.Email
          let pass = "123456"
          var file = res.file
          await this.AngularAuth.createUserWithEmailAndPassword(email, pass).then(res => {
            let user = Object.assign(res);
            this.userCollection.doc(user.user.uid).set({
              User_ID: user.user.uid,
              AccFullName: this.user.AccFullName,
              Image_URL: file,
              Email: this.user.Email,
              Address: this.user.Address,
              Position: this.user.Position,
              Gender: this.user.Gender,
              DateOfBirth: this.user.DateOfBirth,
              Time_Created: time,
              Time_Updated: ''
            })
            this.ListUser = []
            this.GetUser()

          });
          window.alert("Thêm thành công")
          this.Submitted = false
          this.checkhinh = false;
          this.user = new User()




        }
      }
    )
  }
  Delete_User() {
    let email = this.user.Email
    let pass = "123456"
    this.AngularAuth.signInWithEmailAndPassword(email, pass)
      .then(function (info) {
        var user = firebase.auth().currentUser;
        user.delete();
      })
    this.userCollection.doc(this.user.User_ID).delete().then()
    this.GetUser();
    location.reload();
  }
  async Update_User() {
    var time = this.formatTime();
    console.log(this.user)
    alert("this.user.id" + this.user.User_ID)
    await this.userCollection.doc(this.user.User_ID).update({
      AccFullName: this.user.AccFullName,
      Email: this.user.Email,
      Address: this.user.Address,
      Gender: this.user.Gender,
      DateOfBirth: this.user.DateOfBirth,
      Position: this.user.Position,
      Time_Updated: time
    })
    await this.GetUser();
    location.reload();

  }

  innitdatable(data) {
    var enviromenttypescript = this;
    let table = $('#datatables').DataTable({
      data: data,
      destroy: true,
      columns: [
        {
          "render": function (data, type, row, meta) {
            return `<img src="http://localhost:9000/upload/` + row.Image_URL + `" width="100" height="100">`

          }
        },
        {
          "render": function (data, type, row, meta) {
            return row.AccFullName

          }
        },
        {
          "render": function (data, type, row, meta) {
            return row.Email

          }
        },
        {
          "render": function (data, type, row, meta) {
            return row.DateOfBirth

          }
        },
        {
          "render": function (data, type, row, meta) {
            if (row.Position == 'Nhân viên tư Vấn') {
              return '  <button style="width:150px" type="submit" class="btn btn-info pull-left">' + row.Position + '</button>'
            }
            if (row.Position == 'Kế toán') {
              return '  <button style="width:150px" type="submit" class="btn btn-primary pull-left">' + row.Position + '</button>'
            }
            if (row.Position == 'Quản lý') {
              return '  <button style="width:150px" type="submit" class="btn btn-warning pull-left">' + row.Position + '</button>'
            }
            if (row.Position == 'Nhân viên bán thời gian') {
              return '  <button style="width:150px" type="submit" class="btn btn-success pull-left">' + row.Position + '</button>'
            }

          }
        },
      ]
    });
    $('#datatables tbody').on('click', 'tr', function () {
      var res = Object.assign(table.row(this).data());
      enviromenttypescript.user = res
      enviromenttypescript.CheckSua = true;
      enviromenttypescript.CheckTao = false;

    });
  }
  back() {
    this.CheckTao = true;
    this.CheckSua = false;
    this.user = new User();

  }

}
