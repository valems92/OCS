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
        this.cartService.getCart((res) => {
            if (res.status === "error") {
                this.showAlert(res.message, true);
            } else {
                this.clothes = res.cart;
                this.calculateTotalPrice();
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
        let id = this.selectedCloth.id;
        this.cartService.removeFromCart(id).subscribe(
            res => {
                for (let i = 0; i < this.clothes.length; i++) {
                    if(this.clothes[i].id === id) {
                        this.totalPrice -= this.clothes[i].price;
                        this.clothes.splice(i, 1);

                        break;
                    }
                }
                this.showAlert("The cloth was removed form you cart", true);
                this.loading = false;
            },
            err => {
                this.showAlert(err.error.message, false);
                this.loading = false;
            }
        )
    }


    calculateTotalPrice() {
        this.totalPrice = 0;

        for (let i = 0; i < this.clothes.length; i++) {
            this.totalPrice += this.clothes[i].price;
        }
    }

    buyCart() {
        this.loading = true;
        this.cartService.buyCart().subscribe(
            res => {
                this.totalPrice = 0;
                this.clothes = [];
                this.showAlert("Enjoy your new clothes!", true);
                this.loading = false;
            },
            err => {
                this.showAlert(err.error.message, false);
                this.loading = false;
            }
        )
    }
}