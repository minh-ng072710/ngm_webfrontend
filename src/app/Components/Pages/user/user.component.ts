import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import User from '../../../Model/User';

import { AngularFireAuth } from "@angular/fire/auth";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  Submitted: boolean = false;
  CheckTao: boolean = true;
  NgForm: FormGroup;
  ViTri = ["", "Nhân viên tư Vấn", "Kế toán", "Quản lý", "Nhân viên bán thời gian"]

  constructor(private fb: FormBuilder, private readonly afs: AngularFirestore, private AngularAuth: AngularFireAuth) {
    this.CreateForm();
    this.userCollection = this.afs.collection<User>("User");

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
    });
  }


  get f() { return this.NgForm.controls; }
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
  Create_User() {
    this.Submitted = true;

    // stop here if form is invalid
    if (this.NgForm.invalid) {
      return;
    } else {
      let email = this.user.Email
      let pass = "123456"
      this.AngularAuth.createUserWithEmailAndPassword(email, pass).then(res => {
        let user = Object.assign(res);
        this.userCollection.doc(user.user.uid).set({
          id: user.user.uid,
          AccFullName: this.user.AccFullName,
          Position: this.user.Position,
          Gender: this.user.Gender,
          DateOfBirth: this.user.DateOfBirth,
          Address: this.user.Address,
          Email: this.user.Email
        })
        this.ListUser = []
        this.GetUser()
        this.user = new User()
      });
      window.alert("Thêm thành công")
      this.Submitted = false
    }

  }
  Update_User() {

    console.log(this.user)
    this.userCollection.doc(this.user.id).update({
      AccFullName: this.user.AccFullName,
      Position: this.user.Position,
      Gender: this.user.Gender,
      DateOfBirth: this.user.DateOfBirth,
      Address: this.user.Address,
      Email: this.user.Email
    })

    this.GetUser();


  }

  innitdatable(data) {
    var enviromenttypescript = this;


    let table = $('#datatables').DataTable({
      data: data,
      destroy: true,
      columns: [
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
              return '  <button style="width:150px" type="submit" class="btn btn-info pull-left">' + row.Position + '</button>'
            }
            if (row.Position == 'Quản lý') {
              return '  <button style="width:150px" type="submit" class="btn btn-info pull-left">' + row.Position + '</button>'
            }
            if (row.Position == 'Nhân viên bán thời gian') {
              return '  <button style="width:150px" type="submit" class="btn btn-info pull-left">' + row.Position + '</button>'
            }

          }
        },


      ]

    });
    $('#datatables tbody').on('click', 'tr', function () {
      var data = Object.assign(table.row(this).data());
      enviromenttypescript.CheckSua = true;
      enviromenttypescript.CheckTao = false;
      enviromenttypescript.user = data

      // this.checktao=false
      // this.checksua=true




    });

  }
  back() {
    this.CheckTao = true;
    this.CheckSua = false;
  }

}
