import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { AuthGuardUserService } from './auth-guard-user.service';
import { AvaiableServiceService } from './avaiable-service.service';
import { UserLoginService } from "./user-login.service";
@Injectable({
  providedIn: "root",
})

export class CombineGuardService implements CanActivate, CanActivateChild  {

  constructor( private userGuard:AuthGuardUserService,private servicesGuard:AvaiableServiceService) { }
    canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let data = route.data.page as Array<string>;
    console.log("combine guard calling");
    console.log("user",this.userGuard.canActivate(route,state));
    console.log("service",this.servicesGuard.canActivate(route,state));
    return true;
    // return this.userGuard.canActivate(route,state) && this.servicesGuard.canActivate(route,state)
    // .then((res) => {
    //   if (res) {
    //     return true;
    //   } else {
    //     this.router.navigate(["/not-found"]);
    //     return false;
    //   }
    // });
  }
    canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
