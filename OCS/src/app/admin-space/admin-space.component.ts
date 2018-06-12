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
    clothService.clothesByProviderChangeEvent.subscribe((value) => {
      this.providersData = value;
    });

    branchService.branchesChangeEvent.subscribe((value) => {
      this.branches = value;
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

    this.clothService.addNewCloth(data.cloth, (res) => {
      if (res.status === "error")
        this.showAlert(res.message, false);
      else
        this.showAlert("The cloth was added", true);


      this.setLoading(false);
    });
  }

  onAddNewBranch(data) {
    this.setLoading(true);

    this.branchService.addBranch(data, (res) => {
      if (res.status === "error")
        this.showAlert(res.message, false);
      else
        this.showAlert("The cloth was added", true);


      this.setLoading(false);
    });
  }

  setLoading(isLoading) {
    this.loading = isLoading;
  }
}
