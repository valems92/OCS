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
        userService.event.subscribe((value) => {
            this.setUserData(value.user);
        });
    }

    ngOnInit() {
        let user = this.userService.user;
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
        let data = {
            fullName: this.fullName,
            city: this.city,
            address: this.address
        }

        this.userService.updateProfile(data).subscribe(
            res => {
                this.showAlert("Your profile data was changed", true);
                this.loading = false;
            },
            err => {
                this.showAlert(err.error.message, false);
                this.loading = false;
            }
        )
    }

    onChangePassword() {
        this.validPassword = this.validatePassword();
        if (!this.validPassword) {
            this.showAlert("password must be at least 8 characters with lowercase letters, uppercase letters and digits", false);
            return false;
        }

        let data = {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
        };

        this.userService.updatePassword(data).subscribe(
            res => {
                this.oldPassword = "";
                this.newPassword = "";
                this.showAlert("Your password was changed", true);
                this.loading = false;
            },
            err => {
                this.showAlert(err.error.message, false);
                this.loading = false;
            }
        )
    }

    validatePassword() {
        const regExp = new RegExp((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/));
        return regExp.test(this.newPassword);
    }

    onLogout() {
        this.userService.logout(() => {
            this.router.navigate(['./store']);
        });
    }
}
