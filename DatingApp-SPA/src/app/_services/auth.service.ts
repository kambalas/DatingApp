import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { User } from '../_modules/User';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'https://localhost:7031/api/auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User | null = null;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http: HttpClient) { }

changeMemberPhoto(photoUrl: string) {
  this.photoUrl.next(photoUrl);
}

login(model: any) {
  return this.http.post(this.baseUrl + 'login', model).pipe(
    map((response: any) => {
      const user = response;
      if(user) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user.user));
        this.decodedToken = this.jwtHelper.decodeToken(user.token)
        this.currentUser = user.user;
        if (this.currentUser && this.currentUser.photoUrl) { // Add null check
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
          console.log(this.decodedToken);
      }
    })
  );
}

register(model: any) {
  return this.http.post(this.baseUrl + 'register', model);
}

loggedIn() {
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}

roleMatch(allowedRoles: Array<String>): boolean {
  let isMatch = false;
  const userRoles = this.decodedToken.role as Array<String>;
  allowedRoles.forEach(element => {
    if(userRoles.includes(element)) {
      isMatch = true;
      return;
    }
  });
  return isMatch;
}
}
