import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})

export class CateService {

    constructor(private http: HttpClient) { }
    getallcate() {
        return this.http.get(environment.get_all_cate)
    }
    createcate(data) {
        return this.http.post(environment.create_cate, data)
    }
    update(data) {

        return this.http.put(environment.update_cate, data)
    }
    delete(data) {

        return this.http.delete(environment.delete_cate + data.Cate_ID)
    }

}