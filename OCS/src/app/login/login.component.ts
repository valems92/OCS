import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../services/UserService";
import {Router} from "@angular/router";

import {AlertComponent} from '../shared-components/alert/alert.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    @ViewChild(AlertComponent) childAlert:AlertComponent;

    loading:boolean = false;

    regFullName: string;
    regEmail: string;
    regPassword: string;
    regCity: string;
    regAddress: string;

    loginEmail: string;
    loginPassword: string;

    alertMsg:string;
    isAlertSuccess:boolean;

    validPassword:boolean = true;

    constructor(private userService: UserService, private router: Router) {
    }

    ngOnInit() {
    }

    showAlert(msg, isSuccess) {
        this.alertMsg = msg;
        this.isAlertSuccess = isSuccess;

        this.childAlert.show();
    }

    onLogin() {
        this.login(this.loginEmail, this.loginPassword);
    }

    onRegister() {
        this.validPassword = this.validatePassword();
        if (!this.validPassword) {
            this.showAlert("password must be at least 8 characters with lowercase letters, uppercase letters and digits", false);
            return false;
        }

        this.loading = true;

        let newUser = {
            fullName: this.regFullName,
            email: this.regEmail,
            password: this.regPassword,
            city: this.regCity,
            address: this.regAddress
        };

        this.userService.register(newUser, (data) => {
            if (data.status === "success")
                this.login(this.regEmail, this.regPassword);
            else {
                this.showAlert(data.message, false);
                this.loading = false;
            }
        });
    }

    validatePassword() {
        const regExp = new RegExp((/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/));
        return regExp.test(this.regPassword);
    }

    login(email, password) {
        this.loading = true;

        let user = {
            email: email,
            password: password
        };

        this.userService.login(user, (data) => {
            if (data.status === "success")
                this.router.navigate(['./store']);
            else {
                this.showAlert(data.message, false);
            }
            this.loading = false;
        });
    }
}
