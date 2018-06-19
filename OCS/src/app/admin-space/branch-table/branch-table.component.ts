import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Branch} from "../../models/branch.model";
import {BranchService} from '../../services/BranchService';
import {AlertComponent} from "../../shared-components/alert/alert.component";

@Component({
  selector: 'app-branch-table',
  templateUrl: './branch-table.component.html',
  styleUrls: ['./branch-table.component.css']
})
export class BranchTableComponent implements OnInit {
  @ViewChild(AlertComponent) childAlert: AlertComponent;

  @Output() setLoading = new EventEmitter<any>();
  @Input() branches: Branch[];

  alertMsg: string;
  isAlertSuccess: string;

  constructor(private branchService: BranchService) { }

  ngOnInit() {
  }

  showAlert(msg, isSuccess) {
    this.alertMsg = msg;
    this.isAlertSuccess = isSuccess;

    this.childAlert.show();
  }

  onDeleteBranch(branch) {
    this.setLoading.next(true);

    var id = branch.id;
    var self =this;
    this.branchService.deleteBranch(id, function (res) {
      if (res.status === "error")
        self.showAlert(res.message, false);
      else {
        var newBranchArray = self.branches.filter(function (obj) {
          return obj["id"] !== id;
        });

        self.branches = (newBranchArray.length > 0) ? newBranchArray : [];

        self.showAlert("The branch was deleted", true);
      }

      self.setLoading.next(false);
    });
  }
}
