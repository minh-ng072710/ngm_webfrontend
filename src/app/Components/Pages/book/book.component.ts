import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { BookService } from 'src/app/Services/Book.sevice';
import Book from 'src/app/Model/Book';
import { HttpClient } from '@angular/common/http';
import Category from 'src/app/Model/Category';
import { CateService } from 'src/app/Services/Cat.service';
import { JsonPipe } from '@angular/common';

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
  ngForm2: FormGroup;
  checksua: boolean = false
  checktao: boolean = true
  checkhinh: boolean = false;
  checkcat: boolean = false;
  checkbuton: boolean = false;
  filterkey: []
  Category: Category;
  Category_List;
  checktrung: boolean = false;
  check_btn: boolean = true;
  Status = ["Đang Soạn Thảo", "Đã Phát Hành", "Đang Bán"]
  images;
  url = "";

  constructor(private fb: FormBuilder, public db: AngularFireDatabase, private BookService: BookService, private CateService: CateService, private cookies: CookieService, private http: HttpClient) {
    this.createForm();
    this.createForm2();
  }
  get f() { return this.ngForm.controls }
  ngOnInit(): void {
    this.Book = new Book();
    this.BookService.getallbook().subscribe(data => {
      this.ListBook = Object.assign(data);
      this.innitdatable(this.ListBook);
    })
    this.Category = new Category();
    this.http.get<any>('http://localhost:9000/api/cate').subscribe(data => {
      this.Category_List = data;
    })

  }
  reset_book() {
    this.checktrung = false
    this.check_btn = true
  }
  reset_cate() {
    this.checktrung = false
    this.check_btn = true
  }
  check_book(e) {
    console.log(e.target.value)
    for (var i = 0; i < this.ListBook.length; i++) {
      if (e.target.value.toLowerCase().trim() == this.ListBook[i].Book_Name.toLowerCase().trim()) {
        this.checktrung = true
        this.check_btn = false
        break;
      } else {
        this.checktrung = false
        this.check_btn = true
      }
    }
  }

  check_cate(e) {
    console.log(e.target.value)
    for (var i = 0; i < this.Category_List.length; i++) {
      if (e.target.value.trim() == this.Category_List[i].Name_Cat) {
        this.checktrung = true
        this.check_btn = false
        break;
      } else {
        this.checktrung = false
        this.check_btn = true
      }
    }
  }


  //Add New Book
  async Create_Book() {

    this.submitted = true;
    const formdata = new FormData();
    formdata.append('file', this.images);
    await this.http.post<any>("http://localhost:9000/api/file", formdata).subscribe(
      res => {
        if (this.ngForm.invalid) {
          alert("return")
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
            Active: 'Hiện',
            Image_URL: res.file
          }
          this.f.Book_Name.errors
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
  //Update Book
  Update_Book() {
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
  //Delete Book
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
  //Event of btn add new cat
  Add_NewCat() {
    this.checkcat = true;
    this.checktao = false;
  }
  //Add new cate from book component
  async Add_Cate() {
    this.submitted = true;
    if (this.Category.Name_Cat && this.Category.Description_Cat) {
      var cate = {
        Name_Cat: this.Category.Name_Cat,
        Description_Cat: this.Category.Description_Cat,
        Publication_Date: this.Category.Publication_Date,
        Status_Cat: this.Category.Status_Cat
      }
      await this.CateService.createcate(cate).subscribe(data => {
        let res = Object.assign(data)
        if (res.status == 200) {
          window.alert("Thêm Thành công");
          this.checkcat = false;
          this.checktao = true;
          this.Category = new Category();
        } else {
          window.alert("Đã có lỗi xảy ra")
        }
        location.reload();
      })
    } else {
      alert("Điền đầy đủ đi rồi đi cu!!!")
    }
  }
  //Event off btn back_previous
  Back_Cat() {
    this.checkcat = false;
    this.checktao = true;
  }
  // Innit data_construct of datatable 
  innitdatable(data) {
    var enviromenttypescript = this;
    var table = $('#datatables').DataTable(
      {
        data: data,
        destroy: true,
        columns: [
          {
            "render": function (data, type, row, meta) {
              if (row.Active == 'Hiện') {
                return `<img src="http://localhost:9000/upload/` + row.Img_URL + `" width="100" height="100">`
              } else {
                return ''
              }
            }
          },
          {
            "render": function (data, type, row, meta) {
              if (row.Active == 'Hiện') {
                return row.Book_Name
              } else {
                return ''
              }
            }
          },
          {
            "render": function (data, type, row, meta) {
              if (row.Active == 'Hiện') {
                return row.Publication_Date
              } else {
                return ''
              }
            }
          },
          {
            "render": function (data, type, row, meta) {
              if (row.Active == 'Hiện') {
                return row.Category
              } else {
                return ''
              }
            }
          },
          {
            "render": function (data, type, row, meta) {
              if (row.Active == 'Hiện') {
                if (row.Status == 'Đang Soạn Thảo') {
                  return '  <button style="width:150px" type="submit" class="btn btn-danger pull-left">' + row.Status + '</button>'
                }
                if (row.Status == 'Đã Phát Hành') {
                  return '  <button style="width:150px" type="submit" class="btn btn-primary pull-left">' + row.Status + '</button>'
                }
                if (row.Status == 'Đang Bán') {
                  return '  <button style="width:150px;"  type="submit" class="btn btn-success pull-left">' + row.Status + '</button>'
                }
              } else {
                return ''
              }
            }
          }]
      });
    //Click each td of table 
    $('#datatables tbody').on('click', 'tr', function () {
      let res = Object.assign(table.row(this).data());
      enviromenttypescript.Book = res
      enviromenttypescript.checksua = true;
      enviromenttypescript.checktao = false;
    });

  }
  //Update datatable after CRUD
  updatedatable(data) {
    console.log(data)
    $('#datatables').DataTable()
      .clear()
      .rows.add(data)
      .draw();
  }
  // Refresh datatable with new or removed item
  getbook() {
    this.BookService.getallbook().subscribe(data => {
      this.ListBook = Object.assign(data)
      this.updatedatable(this.ListBook)
    })
  }
  //Form 1 for create_new_book()
  createForm() {
    this.ngForm = this.fb.group({
      Book_Name: ['', Validators.required],
      Description: ['', Validators.required],
      Publication_Date: ['', Validators.required],
      Category: ['', Validators.required],
      Status: ['', Validators.required],
      Img_URL: ['', Validators.required],
    });
  }
  //Form 2 for add_cate()
  createForm2() {
    this.ngForm2 = this.fb.group({
      Name_Cat: ['', Validators.required],
      Publication_Date: ['', Validators.required],
      Description_Cat: ['', Validators.required],
      Status_Cat: ['', Validators.required]
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
  // async Update_Book() {
  //   const formdata = new FormData();
  //   if (typeof this.images == undefined) {
  //     alert("1");
  //     formdata.append('file', this.Book.Img_URL);
  //   } else {
  //     alert("2");
  //     formdata.append('file', this.images);

  //   }
  //   alert("formdata: " + JSON.stringify(formdata))

  //   await this.http.post<any>("http://localhost:9000/api/update-file", formdata).subscribe(
  //     res => {

  //       console.log("this.Book: " + this.Book)
  //       console.log("this.res.file: " + res.file)
  //       console.log("this.Book.Img_URL: " + this.Book.Img_URL)
  //       if (res.file) {
  //         let data = {
  //           Book_ID: this.Book.Book_ID,
  //           User_Create: this.cookies.get("email"),
  //           Category: this.Book.Category,
  //           Publication_Date: this.Book.Publication_Date,
  //           Book_Name: this.Book.Book_Name,
  //           Description: this.Book.Description,
  //           Status: this.Book.Status,
  //           Image_URL: res.file,
  //         }
  //         console.log("Data: " + JSON.stringify(data))
  //         this.BookService.update(data).subscribe(data => {
  //           let res = Object.assign(data)
  //           if (res.status == 200) {
  //             window.alert("Sửa Thành công")
  //             this.getbook()
  //           } else {
  //             window.alert("Đã có lỗi xảy ra")
  //           }
  //         })
  //       }

  //     })

  // }//Update have image
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