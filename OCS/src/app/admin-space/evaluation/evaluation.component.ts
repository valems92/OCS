import {Component, Input, OnInit} from '@angular/core';
import {CartService} from "../../services/CartService";
import * as DecisionTree from "decision-tree";

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
  @Input() providersData: any = {};

  objectKeys = Object.keys;
  colors = [];

  selectedPrice = 0;
  selectedProvider = null;
  selectedColor = null;

  purchases = [];
  valuation:boolean = null;

  class_name = "price";
  features = ["provider", "color"];

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.selectedProvider = Object.keys(this.providersData)[0];
    this.getColors();

    this.purchases = [];
    var self = this;

    this.cartService.getAllPurchases().subscribe(function (res) {
      var data = res['data'];
      self.purchases = data;
    }, function (err) {

    });
  }

  predictProductSales() {
    var trainingData = [];

    for (var i = 0; i < this.purchases.length; i++) {
      trainingData.push({
        provider: this.purchases[i].provider,
        color: this.purchases[i].color,
        price: this.purchases[i].price > this.selectedPrice
      });
    }

    var dt = new DecisionTree(trainingData, this.class_name, this.features);

    var predictedClass = dt.predict({
      provider: this.selectedProvider,
      color: this.selectedColor
    });

    this.valuation = predictedClass;
  }

  getColors() {
    for (var provider in this.providersData) {
      for (var i = 0; i < this.providersData[provider].length; i++) {
        var cloth = this.providersData[provider][i];
        var color = cloth.color;

        if (this.colors.indexOf(color) === -1) {
          this.colors.push(color);
        }
      }
    }

    this.selectedColor = this.colors[0];
  }
}
