import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Category from 'src/app/Model/Category';
import { Observable } from 'rxjs'
import { User } from 'src/app/user';
import { CookieService } from 'ngx-cookie-service';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  submitted: boolean = false
  Category: Category;
  ngForm: FormGroup;
  checksua: boolean = false
  checktao: boolean = true
  filterkey: []
  items: Observable<any[]>;
  url = "";
  images;
  constructor(private fb: FormBuilder, public db: AngularFireDatabase, private cookies: CookieService, private http: HttpClient) {
    this.createForm()
  }
  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }

  }

  onSubmit() {
    const formdata = new FormData();
    formdata.append('file', this.images);
    this.http.post<any>("http://localhost:9000/api/file", formdata).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    )

  }
  ngOnInit(): void {

    this.Category = new Category();
  }
  SelectFile(event) {
    console.log(event.target.files)
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result
      }
    }

  }

  createForm() {
    this.ngForm = this.fb.group({
      Name: ['', Validators.required],
      Img_URL: ['', Validators.required],
      Is_Active: ['', Validators.required],
      Description: ['', Validators.required],
    });
  }
  get f() { return this.ngForm.controls; }


  Create_Cat() {
    this.submitted = true;
    if (this.ngForm.invalid) {
      return;
    } else {
      alert("ok")
      console.log(this.Category);

    }
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


}
