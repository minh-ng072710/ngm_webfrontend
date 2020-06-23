import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})

export class BookService {

    constructor(private http: HttpClient) { }
    getallbook() {
        return this.http.get(environment.get_all_book)
    }
    create(data) {
        return this.http.post(environment.create_book, data)
    }
    update(data) {

        return this.http.put(environment.update_book, data)
    }
    delete(data) {

        return this.http.delete(environment.delete_book + data.id)
    }

}