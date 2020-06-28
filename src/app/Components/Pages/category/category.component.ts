import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import Category from 'src/app/Model/Category';
import { CateService } from 'src/app/Services/Cat.service';
import { BookService } from 'src/app/Services/Book.sevice';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  submitted: boolean = false;
  Category: Category;
  Category_List;
  ngForm: FormGroup;
  checksua: boolean = false
  checkcat: boolean = true


  constructor(private fb: FormBuilder, public db: AngularFireDatabase, private CateService: CateService, private BookService: BookService, private cookies: CookieService, private http: HttpClient) {
    this.createForm()
  }
  get f() { return this.ngForm.controls }

  ngOnInit(): void {
    this.Category = new Category();
    this.CateService.getallcate().subscribe(data => {
      this.Category_List = Object.assign(data);
      this.innitdatable(this.Category_List);

    })
  }
  createForm() {
    this.ngForm = this.fb.group({
      Name_Cat: ['', Validators.required],
      Publication_Date: ['', Validators.required],
      Description_Cat: ['', Validators.required],
      Status_Cat: ['', Validators.required],
    });
  }
  back() {
    this.checksua = false
    this.checkcat = true;
    this.Category = new Category();
  }
  async Update_Cate() {
    var data = {
      Cat_ID: this.Category.Cat_ID,
      Name_Cat: this.Category.Name_Cat,
      Description_Cat: this.Category.Description_Cat,
      Publication_Date: this.Category.Publication_Date,
      Status_Cat: this.Category.Status_Cat
    }
    var book_infor = {

      Category_Name: this.Category.Name_Cat,
      Status: this.Category.Status_Cat
    }

    await this.CateService.update(data).subscribe(data => {
      let res = Object.assign(data)
      if (res.status == 200) {
        window.alert("Sửa Thành công")
        this.getcate()
      } else {
        window.alert("Đã có lỗi xảy ra")
      }
    })
    await this.BookService.update(book_infor).subscribe(data1 => {
      let res1 = Object.assign(data1);
      if (res1.status == 200) {
        window.alert("Sửa Thành công book")
      } else {
        window.alert("Đã có lỗi xảy ra")
      }
    })

  }
  async Delete_Cate() {
    let data = {
      Cate_ID: this.Category.Cat_ID,
    }

    await this.CateService.delete(data).subscribe(data => {
      let res = Object.assign(data)
      if (res.status == 200) {
        window.alert(" Xóa Thành công")
        this.getcate()
      } else {
        window.alert("Đã có lỗi xảy ra")
      }
    })
    this.checksua = false;
    this.checkcat = true;
    this.Category = new Category();

  }
  Add_Cate() {
    this.submitted = true;
    if (this.ngForm.invalid) {
      return;
    } else {
      var cate = {
        Name_Cat: this.Category.Name_Cat,
        Description_Cat: this.Category.Description_Cat,
        Publication_Date: this.Category.Publication_Date,
        Status_Cat: this.Category.Status_Cat
      }
      this.CateService.createcate(cate).subscribe(data => {
        let res = Object.assign(data)
        if (res.status == 200) {
          window.alert("Thêm Thành công");
          this.getcate();
          this.Category = new Category();
        } else {
          window.alert("Đã có lỗi xảy ra")
        }
      })
      this.checkcat = true;
      this.submitted = false;
    }

  }
  innitdatable(data) {
    var enviromenttypescript = this;
    var table = $('#datatables').DataTable(
      {
        data: data,
        destroy: true,
        columns: [

          {

            "render": function (data, type, row, meta) {
              if (row.Status_Cat == 'Ẩn') {
                return `<p style="color: darkgray; font-weight: 500;text-decoration: line-through">` + row.Name_Cat + `</p>`

              }
              return row.Name_Cat
            }
          },


          {
            "render": function (data, type, row, meta) {
              if (row.Status_Cat == 'Ẩn') {
                return `<p style="color: darkgray; font-weight: 500;text-decoration: line-through">` + row.Publication_Date + `</p>`

              }
              return row.Publication_Date

            }
          },
          {
            "render": function (data, type, row, meta) {
              if (row.Status_Cat == 'Ẩn') {
                return `<p style="color: darkgray; font-weight: 500;text-decoration: line-through">` + row.Description_Cat + `</p>`

              }
              return row.Description_Cat



            }
          },

        ]
      });
    $('#datatables tbody').on('click', 'tr', function () {
      let res = Object.assign(table.row(this).data());
      enviromenttypescript.Category = res
      enviromenttypescript.checksua = true;
      enviromenttypescript.checkcat = false;
    });

  }

  updatedatable(data) {
    console.log(data)

    $('#datatables').DataTable()
      .clear()
      .rows.add(data)
      .draw();
  }
  getcate() {
    this.CateService.getallcate().subscribe(data => {
      this.Category_List = Object.assign(data);
      this.updatedatable(this.Category_List);
    })
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
