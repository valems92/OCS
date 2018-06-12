import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Cloth} from "../../models/cloth.model";
import {ClothService} from "../../services/ClothService";
import {AlertComponent} from "../../shared-components/alert/alert.component";

@Component({
    selector: 'app-provier-table',
    templateUrl: './provier-table.component.html',
    styleUrls: ['./provier-table.component.css']
})
export class ProvierTableComponent implements OnInit {
    @ViewChild(AlertComponent) childAlert: AlertComponent;
    @Output() setLoading = new EventEmitter<any>();

    @Input() providerName: string;
    @Input() providerClothes: Cloth[];

    alertMsg: string;
    isAlertSuccess: string;

    constructor(private clothService: ClothService, private http: HttpClient) {
    }

    ngOnInit() {
    }

    showAlert(msg, isSuccess) {
        this.alertMsg = msg;
        this.isAlertSuccess = isSuccess;

        this.childAlert.show();
    }

    onDeleteCloth(cloth) {
        this.setLoading.next(true);
        const id = cloth.id;
        this.clothService.deleteCloth(id, (res) => {
            if (res.status === "error")
                this.showAlert(res.message, false);
            else {
                let newClothesArray = this.providerClothes.filter(function (obj) {
                    return obj["id"] !== id;
                });

                this.providerClothes = (newClothesArray.length > 0) ? newClothesArray : [];

                this.showAlert("The cloth was deleted", true);
            }

            this.setLoading.next(false);
        });
    }

    onUpdateCloth(data) {
        this.setLoading.next(true);
        this.clothService.updateCloth(data, (res) => {
            if (res.status === "error")
                this.showAlert(res.message, false);
            else
                this.showAlert("The cloth was updated", true);

            this.setLoading.next(false);
        });
    }
}
