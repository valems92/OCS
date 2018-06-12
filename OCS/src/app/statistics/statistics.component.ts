import {Component, OnInit, ViewChild} from '@angular/core';
import * as d3 from "d3";
import * as color from "color";
import {CartService} from "../services/CartService";
import {AlertComponent} from "../shared-components/alert/alert.component";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  @ViewChild(AlertComponent) childAlert: AlertComponent;

  providersSale = [];
  purchasesColor = [];

  alertMsg: string;
  isAlertSuccess: string;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    var self = this;
    this.providersSale = [];

    this.cartService.getUserPurchases().subscribe(function (res) {
      var data = res['data'];
      self.setData(data);

      self.getProvidersSales();
      self.getPurchasesColors();
    }, function (err) {
      self.showAlert(err.error.message, false);
    });
  }

  setData(data) {
    var colors = {};

    for (var i = 0; i < data.length; i++) {
      this.providersSale.push({
        provider: data[i]._id,
        sales: data[i].count
      });

      var providerColors = data[i].colors;
      for (var j = 0; j < providerColors.length; j++) {
        if (!colors[providerColors[j]]) {
          colors[providerColors[j]] = 0;
        }

        colors[providerColors[j]]++;
      }
    }

    for (var color in colors) {
      this.purchasesColor.push({
        color: color,
        counter: colors[color]
      });
    }
  }

  getPurchasesColors() {
    var self = this,
      svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      radius = Math.min(width, height) / 2,
      g = svg.append("g").attr("transform", "translate(" + radius + "," + radius + ")");

    var pie = d3.pie()
      .value(function (d) {
        return d.counter;
      });

    var path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    var arc = g.selectAll(".arc")
      .data(pie(this.purchasesColor))
      .enter().append("g")
      .attr("class", "arc");

    arc.append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        var c = d.data.color.toLowerCase();
        try {
          color(c);
          return c;
        } catch (e) {
          return self.getRandomColor();
        }
      });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getProvidersSales() {
    var sales = [];
    for (var i = 0; i < this.providersSale.length; i++) {
      sales.push(this.providersSale[i].sales);
    }

    var x = d3.scaleLinear()
      .domain([0, d3.max(sales)])
      .range([0, 500]);

    d3.select(".chart")
      .selectAll("div")
      .data(sales)
      .enter().append("div")
      .style("width", function (d) {
        return x(d) + "px";
      })
      .text(function (d) {
        return d;
      });
  }

  showAlert(msg, isSuccess) {
    this.alertMsg = msg;
    this.isAlertSuccess = isSuccess;

    this.childAlert.show();
  }
}
