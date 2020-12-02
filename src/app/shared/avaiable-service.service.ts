import { Inject, Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute,
  ChildActivationEnd,
} from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { filter, take } from 'rxjs/operators';
import { UserLoginService } from "./user-login.service";
@Injectable({
  providedIn: "root",
})
export class AvaiableServiceService implements CanActivate, CanActivateChild {
  userStatus: any;
  constructor(private loginService: UserLoginService, @Inject(Router) private router: Router,private route: ActivatedRoute) {}
  //canActivated route configure
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    
  ): Observable<boolean> | Promise<boolean> | boolean {
    let restrictedUrl = ['Expense','Leave'];
    let url:any;
    // this.router.events.subscribe((u:any) => {console.log(u); url = u;});
    // let url = this.route['_routerState'].snapshot.url;
    // let url = this.router.url;
    // console.log("curr uu",this.route.snapshot.url);

    let data:any = url.substring(url.lastIndexOf('/') + 1);
    console.log(url);
    console.log(data);
    //let data = route.data.page as Array<string>;
    if(restrictedUrl.includes(data)){
    // return this.loginService.getPlanFeatures(data).then((res) => {
    //   console.log("....service guard called.....");
    //   if (res) {
    //     return true;
    //   } else {
    //     this.router.navigate(["panel/not-found"]);
    //     return true;
    //   }
    // });
    }else{
      return true;
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
