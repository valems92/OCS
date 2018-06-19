import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-cloth-data',
    templateUrl: './cloth-data.component.html',
    styleUrls: ['./cloth-data.component.css']
})
export class ClothDataComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    @Output() addClothEvent = new EventEmitter<any>();

    @Input() title: string;

    id: string = "";
    provider: string = "";
    imageFile: any;
    description: string = "";
    price: number = 0;
    color: string = "";
    imagePath: string = "";

    saved: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    show(cloth) {
        this.saved = false;

        this.id = (cloth) ? cloth.id : "";
        this.provider = (cloth) ? cloth.provider : "";
        this.description = (cloth) ? cloth.description : "";
        this.price = (cloth) ? cloth.price : 0;
        this.color = (cloth) ? cloth.color : "";
        this.imagePath = (cloth) ? cloth.imagePath : "";

        this.childModal.show();
    }

    hide() {
        this.childModal.hide();
    }

    encodeImageFileAsURL() {
        var fileReader = new FileReader();
        var self = this;
        fileReader.onload = function(e) {
            self.imagePath = e.target["result"];
            if (self.saved)
                self.save();
        };

        fileReader.readAsDataURL(self.imageFile);
    }

    onImageChange(e) {
        this.imageFile = e.srcElement.files[0];
        this.encodeImageFileAsURL();
    }

    onSaveChanges() {
        if (!this.imageFile) {
            if (this.imagePath)
                this.save();
        } else {
            if (!this.imagePath)
                this.saved = true;
            else
                this.save()
        }
    }

    save() {
        var data = {
            id: this.id,
            cloth: {
                provider: this.provider,
                description: this.description,
                price: this.price,
                color: this.color,
                imagePath: this.imagePath
            }
        };

        this.addClothEvent.next(data);
        this.hide();
    }
}
