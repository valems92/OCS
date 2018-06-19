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
        var id = cloth.id;
        var self = this;

        this.clothService.deleteCloth(id, function(res) {
            if (res.status === "error")
                self.showAlert(res.message, false);
            else {
                var newClothesArray = self.providerClothes.filter(function (obj) {
                    return obj["id"] !== id;
                });

                self.providerClothes = (newClothesArray.length > 0) ? newClothesArray : [];

                self.showAlert("The cloth was deleted", true);
            }

            self.setLoading.next(false);
        });
    }

    onUpdateCloth(data) {
        this.setLoading.next(true);
        var self = this;
        this.clothService.updateCloth(data, function(res) {
            if (res.status === "error")
                self.showAlert(res.message, false);
            else
                self.showAlert("The cloth was updated", true);

            self.setLoading.next(false);
        });
    }
}
