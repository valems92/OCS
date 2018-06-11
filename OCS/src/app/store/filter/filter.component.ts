import {Component, OnInit} from '@angular/core';
import {ClothService} from "../../services/ClothService";

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
    providers: string[] = [];
    colors: string[] = [];
    maxPrice: number = 0;

    providerSelected:string = "All";
    colorSelected:string = "All";
    selectedPrice:number = 0;

    constructor(private clothService: ClothService) {
        clothService.filterDataChangeEvent.subscribe((value) => {
            this.changeFilterData(value);
        });
    }

    ngOnInit() {
        this.changeFilterData(this.clothService.filterData);
    }

    changeFilterData(value) {
        this.providers = value.providers;
        this.colors = value.colors;
        this.maxPrice = value.maxPrice;

        this.selectedPrice = this.maxPrice;
    }

    onFilter() {
        this.clothService.filterCloth(this.providerSelected, this.colorSelected, this.selectedPrice);
    }
}