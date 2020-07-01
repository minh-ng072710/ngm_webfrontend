import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})

export class UserService {

    constructor(private http: HttpClient) { }
    getalluser() {
        return this.http.get(environment.get_all_user)
    }


}