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

    this.http.get("http://localhost:3000/branch/getBranches").subscribe(
      res => {
        let branches = res["branches"];

        for (let i = 0; i < branches.length; i++) {
          let branch = branches[i];
          let branchObj = new Branch(branches._id, branch.lat, branch.lng, branch.title);
          this.allBranches.push(branchObj);
        }

        this.change();
      },
      err => {
        console.log("There was an error getting the branches");
      }
    )
  }

  addBranch(branch, cb) {
    const KEY = '831b9384415967d556bb545630af309d';
    let url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + branch.lat + '&lon=' + branch.lng + '&APPID=' + KEY;

    let self = this;
    this.http.get(url).subscribe(
      function (res) {
        let title = res['name'];
        branch.title = title;

        self._addBranch(branch, cb);
      },
      function (err) {
        cb({status: "error", message: err.error.message});
      });
  }

  _addBranch(branch, cb) {
    this.http.post("http://localhost:3000/branch/addBranch", branch, {headers: this.headers})
      .subscribe(
        res => {
          let branch = res["branch"];
          let branchObj = new Branch(branch._id, branch.lat, branch.lng, branch.title);

          this.allBranches.push(branchObj);
          this.change();

          cb({status: "success"});
        },
        err => {
          cb({status: "error", message: err.error.message});
        }
      );
  }

  deleteBranch(id, cb) {
    this.http.delete("http://localhost:3000/branch/deleteBranch/" + id, {headers: this.headers}).subscribe(
      res => {
        for (let i = 0; i < this.allBranches.length; i++) {
          if (this.allBranches[i].id === id) {
            this.allBranches.splice(i, 1);
            break;
          }
        }

        this.change();
        cb({status: "success"});
      },
      err => {
        cb({status: "error", message: err.error.message});
      }
    )
  }

  change() {
    this.branchesChangeEvent.next(this.allBranches);
  }
}
