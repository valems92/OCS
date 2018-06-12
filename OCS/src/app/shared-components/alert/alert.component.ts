import {Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
    @Input() isSuccess: boolean;
    @Input() message: string;

    isHidden:boolean = true;

    constructor() {
    }

    ngOnInit() {
    }

    show() {
        if (!this.message || this.message.length === 0) {
            this.message = (this.isSuccess) ? "Success!" : "A general error occurred";
        }

        this.isHidden = false;
        this.dismiss();
    }

    dismiss() {
        setTimeout(() => {
            this.isHidden = true;
        }, 4000)
    }
}
