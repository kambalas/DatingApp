import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_modules/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'https://localhost:7031/api/';



constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users', this.getHttpOptions());
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id, this.getHttpOptions());
  }
  getHttpOptions() {
    const token = localStorage.getItem('token');
    if (!token) {

        console.warn('User token not found in local storage');
        return {};
    }

    return {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token
        })
    };
}
updateUser(id: number, user: User)
{
  return this.http.put<User>(this.baseUrl + 'users/' + id, user, this.getHttpOptions());
}

}
