import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "./UserService";
import {ClothService} from "./ClothService";

import * as $ from 'jquery';

@Injectable()
export class CartService {
  headers: HttpHeaders;

  constructor(private userService: UserService, private clothService: ClothService, private http: HttpClient) {
    this.headers = this.userService.getHeaders();
  }

  getCart(cb) {
    this.http.get("http://localhost:3000/cart/getCart", {headers: this.headers}).subscribe(
      res => {
        let cart = res["cart"];
        cb({status: "success", cart: this.getUserClothes(cart)});
      },
      err => {
        cb({status: "error", message: err.error.message});
      }
    )
  }

  getUserClothes(cart) {
    let cartClothes = [];

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].status === "waiting") {
        cartClothes.push(cart[i].clothId);
      }
    }

    let cartClothesObj = $.extend(true, [], this.clothService.allClothes);
    cartClothesObj = cartClothesObj.filter(c => {
      return cartClothes.indexOf(c.id) > -1;
    });

    return cartClothesObj;
  }

  addToCart(clothId) {
    return this.http.post("http://localhost:3000/cart/addToCart", {clothId: clothId}, {headers: this.headers});
  }

  removeFromCart(clothId) {
    return this.http.delete("http://localhost:3000/cart/removeFromCart/" + clothId, {headers: this.headers});
  }

  buyCart() {
    return this.http.post("http://localhost:3000/cart/buyCart", {}, {headers: this.headers});
  }

  getUserPurchases() {
    return this.http.get("http://localhost:3000/cart/getPurchases", {headers: this.headers});
  }

  getAllPurchases() {
    return this.http.get("http://localhost:3000/cart/getAllPurchases", {headers: this.headers});
  }
}
