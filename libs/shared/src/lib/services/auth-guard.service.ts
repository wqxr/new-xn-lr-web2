import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  CanActivateChild,
} from '@angular/router';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private user: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.doCheck(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.doCheck(route, state);
  }

  private doCheck(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    if (url === '/login') {
      return of(true);
    }

    return this.user.checkLogin().pipe(
      mergeMap(() => {
        if (!this.user.isLogined()) {
          this.user.setRedirectUrl(url);
          this.router.navigate(['/login']);
          return of(false);
        } else {
          this.user.pushUrl(url);
          return of(true);
        }
      })
    );
  }
}
