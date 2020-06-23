import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { BookService } from 'src/app/Services/Book.sevice';
import Book from 'src/app/Model/Book';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  submitted: boolean = false;
  ListBook;
  Book: Book;
  ngForm: FormGroup;
  checksua: boolean = false
  checktao: boolean = true
  checkhinh: boolean = false;
  filterkey: []
  Category = ["Tình cảm", "Kinh Dị", "Hoạt Hình", "Viễn Tưởng", "Hành Động", "Nhạc Kịch", "Khác..."]
  Status = ["Dự Kiến", "Đã Phát Hành", "Đang khởi chiếu"]
  images;
  url = "";

  constructor(private fb: FormBuilder, public db: AngularFireDatabase, private BookService: BookService, private cookies: CookieService, private http: HttpClient) {
    this.createForm();
  }
  get f() { return this.ngForm.controls }
  ngOnInit(): void {
    this.Book = new Book();
    this.BookService.getallbook().subscribe(data => {
      this.ListBook = Object.assign(data);
      this.innitdatable(this.ListBook);
    })
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
              return `<img src="http://localhost:9000/upload/` + row.Img_URL + `" width="100" height="100">`

            }
          },
          {
            "render": function (data, type, row, meta) {
              return row.Book_Name

            }
          },


          {
            "render": function (data, type, row, meta) {
              return row.Publication_Date

            }
          },
          {
            "render": function (data, type, row, meta) {
              return row.Category

            }
          },
          {
            "render": function (data, type, row, meta) {
              if (row.Status == 'Dự Kiến') {
                return '  <button style="width:150px" type="submit" class="btn btn-info pull-left">' + row.Status + '</button>'
              }
              if (row.Status == 'Đã Phát Hành') {
                return '  <button style="width:150px" type="submit" class="btn btn-primary pull-left">' + row.Status + '</button>'
              }
              if (row.Status == 'Đang khởi chiếu') {
                return '  <button style="width:150px;"  type="submit" class="btn btn-success pull-left">' + row.Status + '</button>'
              }

            }
          }

        ]
      });
    $('#datatables tbody').on('click', 'tr', function () {
      let res = Object.assign(table.row(this).data());
      enviromenttypescript.Book = res
      enviromenttypescript.checksua = true;
      enviromenttypescript.checktao = false;
    });

  }
  updatedatable(data) {
    console.log(data)

    $('#datatables').DataTable()
      .clear()
      .rows.add(data)
      .draw();
  }
  getbook() {
    this.BookService.getallbook().subscribe(data => {
      this.ListBook = Object.assign(data)
      this.updatedatable(this.ListBook)
    })
  }
  createForm() {
    this.ngForm = this.fb.group({
      Book_Name: ['', Validators.required],
      Description: ['', Validators.required],
      Publication_Date: ['', Validators.required],
      Category: ['', Validators.required],
      Status: ['', Validators.required]
    });
  }
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

  async Create_Book() {

    this.submitted = true;
    const formdata = new FormData();
    formdata.append('file', this.images);
    await this.http.post<any>("http://localhost:9000/api/file", formdata).subscribe(
      res => {
        if (this.ngForm.invalid) {
          return;
        } else {
          console.log("Book nè: " + this.Book);
          let data = {
            User_Create: this.cookies.get("email"),
            Category: this.Book.Category,
            Publication_Date: this.Book.Publication_Date,
            Book_Name: this.Book.Book_Name,
            Description: this.Book.Description,
            Status: this.Book.Status,
            Image_URL: res.file
          }
          this.BookService.create(data).subscribe(data => {
            let res = Object.assign(data)
            if (res.status == 200) {
              window.alert("Thêm Thành công");
              this.checkhinh = false;

              this.getbook()
              this.Book = new Book();

            } else {
              window.alert("Đã có lỗi xảy ra")

            }
          })
          console.log("data: " + JSON.stringify(data));
          this.checktao = true;
          this.submitted = false
        }
      }
    )


  }
  Update_Book() {
    console.log(this.Book)
    let data = {
      Book_ID: this.Book.Book_ID,
      User_Create: this.cookies.get("email"),
      Category: this.Book.Category,
      Publication_Date: this.Book.Publication_Date,
      Book_Name: this.Book.Book_Name,
      Description: this.Book.Description,
      Status: this.Book.Status
    }
    this.BookService.update(data).subscribe(data => {
      let res = Object.assign(data)
      if (res.status == 200) {
        window.alert("Sửa Thành công")
        this.getbook()
      } else {
        window.alert("Đã có lỗi xảy ra")
      }
    })
  }
  DeleteBook() {
    let data = {
      id: this.Book.Book_ID,
    }
    this.BookService.delete(data).subscribe(data => {
      let res = Object.assign(data)
      if (res.status == 200) {
        window.alert(" Xóa Thành công")
        this.getbook()
      } else {
        window.alert("Đã có lỗi xảy ra")
      }
    })
    this.checksua = false;
    this.checktao = true;
    this.Book = new Book();
  }
  tam = []
  filter(e, item) {
    if (e.target.checked) {
      this.tam.push(item);
      console.log(this.tam);
      let listafterfilter = []
      for (let i = 0; i < this.tam.length; i++) {
        for (let j = 0; j < this.ListBook.length; j++) {
          //console.log(this.listmovie[j].tenPhim)
          //console.log(this.listmovie[j].trangThai)
          if (this.tam[i] == this.ListBook[j].Status) {

            listafterfilter.push(this.ListBook[j])

          }
        }
        console.log(listafterfilter)
      }
      this.updatedatable(listafterfilter)
    }
    else {
      let updateItem = this.tam.find(this.findIndexToUpdate, item);

      let index = this.tam.indexOf(updateItem);
      let listafterfilter = []
      this.tam.splice(index, 1);

      if (this.tam.length == 0) {
        this.updatedatable(this.ListBook)
      } else {

        for (let i = 0; i < this.tam.length; i++) {

          for (let j = 0; j < this.ListBook.length; j++) {

            if (this.tam[i] == this.ListBook[j].Status) {

              listafterfilter.push(this.ListBook[j])

            }
          }
        }
        this.updatedatable(listafterfilter)
      }
    }
  }
  findIndexToUpdate(type) {
    console.log("type nè" + type)
    return type.id === this;
  }
  back() {
    this.checktao = true
    this.checksua = false;
    this.Book = new Book()
  }

}
