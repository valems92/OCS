import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "./UserService";
import {Branch} from "../models/branch.model";
import {Subject} from 'rxjs/Subject';

@Injectable()
export class BranchService {
  headers: HttpHeaders;
  branchesChangeEvent: Subject<Branch[]> = new Subject<Branch[]>();

  allBranches: Branch[] = [];

  constructor(private userService: UserService, private http: HttpClient) {
    this.headers = this.userService.getHeaders();

    var self = this;
    this.http.get("http://localhost:3000/branch/getBranches").subscribe(
      function (res) {
        var branches = res["branches"];

        for (var i = 0; i < branches.length; i++) {
          var branch = branches[i];
          var branchObj = new Branch(branches._id, branch.lat, branch.lng, branch.title);
          self.allBranches.push(branchObj);
        }

        self.change();
      },
      function (err) {
        console.log("There was an error getting the branches");
      }
    )
  }

  addBranch(branch, cb) {
    var KEY = '831b9384415967d556bb545630af309d';
    var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + branch.lat + '&lon=' + branch.lng + '&APPID=' + KEY;

    var self = this;
    this.http.get(url).subscribe(
      function (res) {
        var title = res['name'];
        branch.title = title;

        self._addBranch(branch, cb);
      },
      function (err) {
        cb({status: "error", message: err.error.message});
      });
  }

  _addBranch(branch, cb) {
    var self = this;
    this.http.post("http://localhost:3000/branch/addBranch", branch, {headers: this.headers})
      .subscribe(
        function(res) {
          var branch = res["branch"];
          var branchObj = new Branch(branch._id, branch.lat, branch.lng, branch.title);

          self.allBranches.push(branchObj);
          self.change();

          cb({status: "success"});
        },
        function(err) {
          cb({status: "error", message: err.error.message});
        }
      );
  }

  deleteBranch(id, cb) {
    var self = this;
    this.http.delete("http://localhost:3000/branch/deleteBranch/" + id, {headers: this.headers}).subscribe(
      function(res) {
        for (var i = 0; i < self.allBranches.length; i++) {
          if (self.allBranches[i].id === id) {
            self.allBranches.splice(i, 1);
            break;
          }
        }

        self.change();
        cb({status: "success"});
      },
      function(err) {
        cb({status: "error", message: err.error.message});
      }
    )
  }

  change() {
    this.branchesChangeEvent.next(this.allBranches);
  }
}
