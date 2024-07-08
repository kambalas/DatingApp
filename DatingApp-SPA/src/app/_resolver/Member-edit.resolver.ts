import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../_modules/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MemberEditResolver implements Resolve<User | null> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {
    const userId = this.authService.decodedToken.nameid;
    return this.userService.getUser(userId).pipe(
      catchError(error => {
        this.handleError();
        return of(null);
      })
    );
  }

  private handleError() {
    this.alertify.error('Problem retrieving your data');
    this.router.navigate(['/members']);
  }
}
