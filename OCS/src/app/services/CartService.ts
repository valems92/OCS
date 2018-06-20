import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "./UserService";
import {ClothService} from "./ClothService";

import * as $ from 'jquery';

@Injectable()
export class CartService {

  constructor(private userService: UserService, private clothService: ClothService, private http: HttpClient) {

  }

  getCart(cb) {
    var self = this;
    this.http.get("http://localhost:3000/cart/getCart", {headers: this.userService.getHeaders()}).subscribe(
      function(res) {
        var cart = res["cart"];
        cb({status: "success", cart: self.getUserClothes(cart)});
      },
      function(err) {
        cb({status: "error", message: err.error.message});
      }
    )
  }

  getUserClothes(cart) {
    var cartClothes = [];

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].status === "waiting") {
        cartClothes.push(cart[i].clothId);
      }
    }

    var cartClothesObj = $.extend(true, [], this.clothService.allClothes);

    cartClothesObj = cartClothesObj.filter(function(c) {
      return cartClothes.indexOf(c.id) > -1;
    });

    return cartClothesObj;
  }

  addToCart(clothId) {
    return this.http.post("http://localhost:3000/cart/addToCart", {clothId: clothId}, {headers: this.userService.getHeaders()});
  }

  removeFromCart(clothId) {
    return this.http.delete("http://localhost:3000/cart/removeFromCart/" + clothId, {headers: this.userService.getHeaders()});
  }

  buyCart() {
    return this.http.post("http://localhost:3000/cart/buyCart", {}, {headers: this.userService.getHeaders()});
  }

  getUserPurchases() {
    return this.http.get("http://localhost:3000/cart/getPurchases", {headers: this.userService.getHeaders()});
  }

  getAllPurchases() {
    return this.http.get("http://localhost:3000/cart/getAllPurchases", {headers: this.userService.getHeaders()});
  }
}
