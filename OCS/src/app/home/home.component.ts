import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {Banner} from "./banner.model";

declare var require: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('arrow') arrow: ElementRef;

  myInterval: number = 4000;
  activeSlideIndex: number = 0;
  showIndicator: boolean = true;
  noWrapSlides: boolean = false;
  Banners: Banner[] = [
    new Banner("You won't find better cloth!", require("../../assets/images/banner1.jpg"), "Best Cloth!"),
    new Banner("Best prices, best quality!", require("../../assets/images/banner2.jpg"), "Buy Now!")
  ];

  constructor() {
  }

  ngOnInit() {
    var ctx: CanvasRenderingContext2D = this.arrow.nativeElement.getContext('2d');

    ctx.fillStyle = "#222222";
    ctx.canvas.height = 60;
    ctx.canvas.width = 20;

    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(20, 30);
    ctx.lineTo(0, 50);
    ctx.fill();
  }
}
