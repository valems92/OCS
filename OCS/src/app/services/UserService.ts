import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user.model";
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class UserService {
  token: any = null;
  user: User = null;
  headers: HttpHeaders = null;
  event: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {
    if (this.loggedIn()) {
      this.loadToken();
      var self = this;
      this.getProfile().subscribe(
        function (res) {
          var user = res["user"];
          self.user = new User(user.email, user.fullName, user.city, user.address, user.role);

          self.change();
        },
        function (err) {
          console.log("auto-login error");
        }
      );
    }
  }

  isAdmin() {
    return this.user && this.user.role === "admin";
  }

  loadToken() {
    this.token = localStorage.getItem('token');
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);

    this.token = token;
    this.user = new User(user.email, user.fullName, user.city, user.address, user.role);
  }

  getHeaders() {
    if (!this.headers) {
      var headers = new HttpHeaders();
      headers = headers.append("authorization", this.token);
      headers = headers.append("Content-Type", "application/json");

      this.headers = headers;
    }

    return this.headers;
  }

  logout(cb) {
    this.token = null;
    this.user = null;
    this.headers = null;

    localStorage.clear();
    this.change();

    cb();
  }

  loggedIn() {
    return tokenNotExpired();
  }

  change() {
    this.event.next({user: this.user});
  }

  /*************** PUBLIC ****************/
  register(newUser, cb) {
    this.http.post("http://localhost:3000/user/register", newUser).subscribe(
      function (res) {
        cb({status: "success"});
      },
      function (err) {
        cb({status: "error", message: err.error.message});
      }
    )
  }

  login(data, cb) {
    if (!data)
      data = {token: this.token};

    var self = this;
    this.http.post("http://localhost:3000/user/login", data).subscribe(
      function (res) {
        self.storeUserData(res["token"], res["user"]);
        self.change();

        if (cb)
          cb({status: "success"});
      },
      function (err) {
        self.token = null;
        if (cb)
          cb({status: "error", message: err.error.message});
      });
  }

  /*************** AUTH ****************/
  getProfile() {
    var headers = this.getHeaders();
    return this.http.get('http://localhost:3000/user/profile', {headers: headers});
  }

  updatePassword(data) {
    var headers = this.getHeaders();
    return this.http.post("http://localhost:3000/user/updatePassword", data, {headers: headers});
  }

  updateProfile(data) {
    var headers = this.getHeaders();
    return this.http.post("http://localhost:3000/user/updateProfile", data, {headers: headers});
  }
}
