import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ClothService} from "../services/ClothService";
import {BranchService} from "../services/BranchService";
import {Branch} from "../models/branch.model";
import {AlertComponent} from "../shared-components/alert/alert.component";

@Component({
  selector: 'app-admin-space',
  templateUrl: './admin-space.component.html',
  styleUrls: ['./admin-space.component.css']
})

export class AdminSpaceComponent implements OnInit {
  @ViewChild(AlertComponent) childAlert: AlertComponent;

  objectKeys = Object.keys;
  providersData: any = {};
  loading: boolean = false;

  branches: Branch[] = [];

  alertMsg: string;
  isAlertSuccess: string;

  constructor(private http: HttpClient, private clothService: ClothService, private branchService: BranchService) {
    var self = this;
    clothService.clothesByProviderChangeEvent.subscribe(function(value) {
      self.providersData = value;
    });

    branchService.branchesChangeEvent.subscribe(function(value) {
      self.branches = value;
    });
  }

  ngOnInit() {
    this.branches = this.branchService.allBranches;
    this.providersData = this.clothService.clothesByProvider;
  }

  showAlert(msg, isSuccess) {
    this.alertMsg = msg;
    this.isAlertSuccess = isSuccess;

    this.childAlert.show();
  }

  getProviderData(provider) {
    return this.providersData[provider];
  }

  onAddNewCloth(data) {
    this.setLoading(true);

    var self = this;
    this.clothService.addNewCloth(data.cloth, function(res) {
      if (res.status === "error")
        self.showAlert(res.message, false);
      else
        self.showAlert("The cloth was added", true);


      self.setLoading(false);
    });
  }

  onAddNewBranch(data) {
    this.setLoading(true);

    var self = this;
    this.branchService.addBranch(data, function(res) {
      if (res.status === "error")
        self.showAlert(res.message, false);
      else
        self.showAlert("The cloth was added", true);


      self.setLoading(false);
    });
  }

  setLoading(isLoading) {
    this.loading = isLoading;
  }
}
