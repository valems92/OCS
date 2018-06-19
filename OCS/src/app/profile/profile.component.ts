import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../services/UserService";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared-components/alert/alert.component";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    @ViewChild(AlertComponent) childAlert: AlertComponent;
    loading: boolean = false;

    fullName: string;
    city: string;
    address: string;

    oldPassword: string;
    newPassword: string;

    validPassword: boolean = true;

    alertMsg: string;
    isAlertSuccess: boolean;

    constructor(private userService: UserService, private router: Router) {
      var self = this;
        userService.event.subscribe(function(value) {
            self.setUserData(value.user);
        });
    }

    ngOnInit() {
        var user = this.userService.user;
        this.setUserData(user);
    }

    setUserData(user) {
        this.fullName = (user) ? user.fullName : "";
        this.city = (user) ? user.city : "";
        this.address = (user) ? user.address : "";
    }

    showAlert(msg, isSuccess) {
        this.alertMsg = msg;
        this.isAlertSuccess = isSuccess;

        this.childAlert.show();
    }

    onChangeProfile() {
        var data = {
            fullName: this.fullName,
            city: this.city,
            address: this.address
        };

        var self = this;
        this.userService.updateProfile(data).subscribe(
            function(res) {
                self.showAlert("Your profile data was changed", true);
                self.loading = false;
            },
            function(err) {
                self.showAlert(err.error.message, false);
                self.loading = false;
            }
        )
    }

    onChangePassword() {
        this.validPassword = this.validatePassword();
        if (!this.validPassword) {
            this.showAlert("password must be at least 8 characters with lowercase letters, uppercase letters and digits", false);
            return false;
        }

        var data = {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
        };

        var self = this;
        this.userService.updatePassword(data).subscribe(
            function(res) {
                self.oldPassword = "";
                self.newPassword = "";
                self.showAlert("Your password was changed", true);
                self.loading = false;
            },
            function(err) {
                self.showAlert(err.error.message, false);
                self.loading = false;
            }
        )
    }

    validatePassword() {
        var regExp = new RegExp((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/));
        return regExp.test(this.newPassword);
    }

    onLogout() {
      var self = this;
        this.userService.logout(function() {
            self.router.navigate(['./store']);
        });
    }
}
