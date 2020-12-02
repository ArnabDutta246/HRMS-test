import { Injectable, EventEmitter } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { SweetAlertService } from "./sweet-alert.service";
import { HttpClient } from "@angular/common/http";
import { sKey } from '../extra/sKey';
import { NgxSpinnerService } from 'ngx-spinner';
import * as CryptoJS from "crypto-js";
import { combineLatest, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: "root",
})
export class AllCollectionsService {
  notification: string;
  latestAlert: string;
  users: string;
  subscribers: string;
  kpi: string;
  noti: string;
  subscriptionOption:string;

  //------------------------------no need----------------------------
  meetings: string;
  risks: string;
  issues: string;
  tasks: string;
  //-----------all email path--------------
  meetingInvite: any = "https://appsolzone.com/mail/meetingInvite.php";
  meetingUpdate: any = "https://appsolzone.com/mail/updateMeeting.php";
  taskInit: any = "https://appsolzone.com/mail/task.php";
  issueInit: any = "https://appsolzone.com/mail/issue.php";
  riskInit: any = "https://appsolzone.com/mail/risk.php";
  taskUpdate: any = "https://appsolzone.com/mail/updateTask.php";
  issueUpdate: any = "https://appsolzone.com/mail/updateIssue.php";
  riskUpdate: any = "https://appsolzone.com/mail/updateRisk.php";
  commentInit: any = "https://appsolzone.com/mail/comment.php";
  shareMeetingMinutesPath: any = "https://appsolzone.com/mail/minutes.php";
  shareIssuePath: any = "https://appsolzone.com/mail/issueShare.php";
  shareTaskPath: any = "https://appsolzone.com/mail/taskShare.php";
  shareRiskPath: any = "https://appsolzone.com/mail/riskShare.php";
  //------------------------------no need----------------------------

  //========================
  // hrms collections
  public _EXPENSES: string;
  public _REGIONS: string;
  public _LEAVE_CALENDER: string;
  // public _NOTIFICATION: string;
  public _LEAVES_RULES: string;
  public _LEAVES_APPLIED: string;
  public _USER_LEAVE_CALENDAR: string;
  public _COLL_HOLIDAY: string;
  public _DASHBOARD: string;
  public _COLL_ATTENDANCE: string;
  public _COLL_ATTENDANCE_REGULATOR: string;
  public _COLL_LEAVE_REGULATOR: string;
  public _COLL_EXPENSE_REGULATOR: string;
  public _COLL_USER_EXPENSE_REGULATOR: string;
  //-----------all email path--------------
  adminUserRes: any = "https://appsolzone.com/mail/addUser.php";
  userRes: any = "https://appsolzone.com/mail/register.php";
  planData:any;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    private router:Router
  ) {
    this.notification = "/notifications/";
    this.latestAlert = "/latestAlerts/";
    this.users = "users";
    this.subscribers = "subscribers";
    this.noti = "notifications";
    this.subscriptionOption = 'subscriptionOption';
    // hrms collections
    this._EXPENSES = "expenses";
    this._LEAVES_RULES = "leaveRules";
    this._COLL_HOLIDAY = "holidays";
    this._DASHBOARD = "dashboard";
    this._COLL_ATTENDANCE = "attendance";
    this._COLL_ATTENDANCE_REGULATOR = "attendanceRegional";
    this._COLL_LEAVE_REGULATOR = "leaveRegional";
    this._COLL_EXPENSE_REGULATOR = "expenseRegional";
    this._COLL_USER_EXPENSE_REGULATOR = "userExpenseSummary";
    this._USER_LEAVE_CALENDAR="userLeaveCalendar";
    // latest hrms collection
    this._REGIONS = "regions";
    this._LEAVES_APPLIED = "leavesApplied";
    this._LEAVE_CALENDER = "leaveCalender";
  }

  getSubscriptionplans() {
    return this.afs.collection("subscriptionOptions").ref;
  }
  getSubscriberCollection() {
    return this.afs.collection("subscribers").ref;
  }
  getSubscriberCollectionColOnly() {
    return this.afs.collection("subscribers");
  }
  getUserCollection() {
    return this.afs.collection("users").ref;
  }
  getUserCollectionColOnly() {
    return this.afs.collection("users");
  }
  getCartCollction() {
    return this.afs.collection("cart").ref;
  }
  getCartCollectionColOnly() {
    return this.afs.collection("cart");
  }
  getTransactionCollection() {
    return this.afs.collection("transactions").ref;
  }
  getTransactionCollectionColOnly() {
    return this.afs.collection("transactions");
  }
  //---------------- add data in a collection
  adddata(collectionName: string, collectionObject: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.afs
        .collection(collectionName)
        .add(collectionObject)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  //-------------------------------
  updateData(collectionName: string, documentId: string, data: any) {
    return new Promise((resolve: any, reject: any) => {
      this.afs
        .collection(collectionName)
        .doc(documentId)
        .update(data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  //---------------add data in specific field-------------
  addDataInSpecificId(collectionName: string, collectionId: any, collectionObject: any): Promise<any>{
    return new Promise((resolve: any, reject: any) => {
      this.afs.collection(collectionName).doc(collectionId).set(collectionObject).then(res =>{
        resolve(res);
      }).catch(err =>{
        reject(err);
      });
    });
  }
  //------------sed custom email-----------------------
  sendCustomEmail(path, data) {
    return new Promise((resolve: any, reject: any) => {
      this.httpClient
        .post(path, data, { responseType: "text" as "json" })
        .subscribe((res) => {
          console.log("Email", res);
          resolve(res);
        });
    });
  }




  //===================== validate url =================
 getOrgAndPlanData(forComponent?:boolean){
    return new Promise((res,rej)=>{
    let s;
    let getSession = JSON.parse(this.returnSessionData()); 
    console.log("new session data now:",getSession);
    let orgData = this.afs.collection(this.subscribers).doc(getSession.subscriberId).ref;
    return orgData.get().then(function(result) {
        let org = result.data();
        s = org.subscriptionType.charAt(0) + org.subscriptionType.slice(1,org.length).toLowerCase();

        if(forComponent){
         let plan = this.afs.collection('subscriptionOptions')
          .doc(s).ref;
          return plan.get().then(function(result) {
            this.planData = result.data();
            console.log(this.planData);
            return res(result.data()); 
          }.bind(this))
         
        }
         return res(s); 
      }.bind(this))
    })
  }

 getPlanData(check?:any){
 return new Promise((res,rej)=>{
  return this.getOrgAndPlanData().then((data:any)=>{
      let accessHas:boolean = false; 
      let plan = this.afs.collection('subscriptionOptions')
        .doc(data).ref;
      plan.get().then(function(result) {
        let planData = result.data();
        this.planData = planData;
        console.log("this plan data",planData);
        let services = planData.services.map(d=>d.name);
        if(check && services.includes(check)){
        planData.services.map((d)=>{
          if(d.name == check) accessHas = d.available});
          if(!accessHas){
            this.router.navigate(["/panel/not-found"]);
          }
        }  
          this.spinner.hide(); 
          return res(planData);
       }.bind(this))
      });
  }) 
 }


  returnSessionData() {
    if (sessionStorage.getItem("user") !== null) {
      const data = sessionStorage.getItem("user");
      var bytes = CryptoJS.AES.decrypt(data, sKey);
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      let getUserData = decryptedData;
      return getUserData;
    }
  }

  getPlanDataAll(){
  let getSession = JSON.parse(this.returnSessionData());
  let s = getSession.admin.subscriptionType.charAt(0) + getSession.admin.subscriptionType.slice(1,getSession.admin.subscriptionType.length).toLowerCase(); 
   return this.afs.collection('subscriptionOptions').doc(s).snapshotChanges();
  }

}
