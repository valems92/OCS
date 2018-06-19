import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/UserService";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
    logged:boolean = false;
    admin:boolean = false;

    constructor (private userService: UserService) {
      var self = this;
        userService.event.subscribe(function(value) {
            self.isLogged(value);
        });
    }

    ngOnInit() {
        this.isLogged(this.userService);
    }

    isLogged(data) {
        this.logged = data.user !== null;
        if (this.logged) {
            this.admin = data.user.role === "admin";
        }
    }
}
