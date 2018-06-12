import {Component, Input, OnInit} from '@angular/core';
import {Cloth} from '../../models/cloth.model';

@Component({
    selector: 'app-cloth',
    templateUrl: './cloth.component.html',
    styleUrls: ['./cloth.component.css']
})

export class ClothComponent implements OnInit {
    @Input() columns: number;
    @Input() cloth: Cloth;

    constructor() {
    }

    ngOnInit() {
    }

}