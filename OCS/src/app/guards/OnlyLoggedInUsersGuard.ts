import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from "../services/UserService";

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {
    };

    canActivate() {
        if (this.userService.user) {
            return true;
        } else {
            console.log("You don't have permission to view this page");
            this.router.navigate(['./store']);
            return false;
        }
    }
}