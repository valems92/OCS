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

    const id = branch.id;
    this.branchService.deleteBranch(id, (res) => {
      if (res.status === "error")
        this.showAlert(res.message, false);
      else {
        let newBranchArray = this.branches.filter(function (obj) {
          return obj["id"] !== id;
        });

        this.branches = (newBranchArray.length > 0) ? newBranchArray : [];

        this.showAlert("The branch was deleted", true);
      }

      this.setLoading.next(false);
    });
  }
}
