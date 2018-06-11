import {Component, OnInit} from '@angular/core';
import {Cloth} from "../../models/cloth.model";
import {ClothService} from "../../services/ClothService";

@Component({
    selector: 'app-clothes-list',
    templateUrl: './clothes-list.component.html',
    styleUrls: ['./clothes-list.component.css']
})
export class ClothesListComponent implements OnInit {
    columns: number = 4;
    clothes: Cloth[] = [];

    constructor(private clothService: ClothService) {
        clothService.allClothesChangeEvent.subscribe((value) => {
            this.clothes = value;
        });
    }

    ngOnInit() {
        this.clothes = this.clothService.allClothes;
    }
}
