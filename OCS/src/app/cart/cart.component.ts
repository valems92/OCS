import {Component, OnInit, ViewChild} from '@angular/core';
import {CartService} from "../services/CartService";
import {Cloth} from "../models/cloth.model";
import {ModalComponent} from "../shared-components/modal/modal.component";
import {AlertComponent} from "../shared-components/alert/alert.component";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    @ViewChild(AlertComponent) childAlert: AlertComponent;
    @ViewChild('childModal') childModal: ModalComponent;

    loading:boolean = false;

    columns: number = 3;
    totalPrice: number = 0;
    clothes: Cloth[] = [];

    selectedCloth: Cloth = null;
    modalContent:string;
    modalType:string;

    alertMsg: string;
    isAlertSuccess: string;

    constructor(private cartService: CartService) {
    }

    ngOnInit() {
      var self = this;
        this.cartService.getCart(function(res) {
            if (res.status === "error") {
                self.showAlert(res.message, true);
            } else {
                self.clothes = res.cart;
                self.calculateTotalPrice();
            }
        })
    }

    showAlert(msg, isSuccess) {
        this.alertMsg = msg;
        this.isAlertSuccess = isSuccess;

        this.childAlert.show();
    }

    openRemoveFromCartConfirmation(cloth) {
        this.modalType = "remove";
        this.modalContent = "Are you sure you want to remove this cloth from your cart?";

        this.selectedCloth = cloth;
        this.childModal.show();
    }

    buyCartConfirmation() {
        this.modalType = "buy";
        this.modalContent = "Are you sure you want to buy the items in your cart?";

        this.childModal.show();
    }

    onConfirmationClosed(res) {
        if (res && this.modalType === "buy")
            this.buyCart();

        if (this.modalType === "remove") {
            if (res)
                this.removeClothFromCart();
            this.selectedCloth = null;
        }
    }

    removeClothFromCart() {
        this.loading = true;
        var id = this.selectedCloth.id;

        var self = this;
        this.cartService.removeFromCart(id).subscribe(
            function(res) {
                for (var i = 0; i < self.clothes.length; i++) {
                    if(self.clothes[i].id === id) {
                        self.totalPrice -= self.clothes[i].price;
                        self.clothes.splice(i, 1);

                        break;
                    }
                }
                self.showAlert("The cloth was removed form you cart", true);
                self.loading = false;
            },
            function(err) {
                self.showAlert(err.error.message, false);
                self.loading = false;
            }
        )
    }


    calculateTotalPrice() {
        this.totalPrice = 0;

        for (var i = 0; i < this.clothes.length; i++) {
            this.totalPrice += this.clothes[i].price;
        }
    }

    buyCart() {
        this.loading = true;

        var self = this;
        this.cartService.buyCart().subscribe(
            function(res) {
                self.totalPrice = 0;
                self.clothes = [];
                self.showAlert("Enjoy your new clothes!", true);
                self.loading = false;
            },
            function(err) {
                self.showAlert(err.error.message, false);
                self.loading = false;
            }
        )
    }
}
