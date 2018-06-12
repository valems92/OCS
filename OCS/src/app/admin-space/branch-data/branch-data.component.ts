import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-branch-data',
  templateUrl: './branch-data.component.html',
  styleUrls: ['./branch-data.component.css']
})
export class BranchDataComponent implements OnInit {
  @ViewChild('childModal') public childModal: ModalDirective;
  @Output() addBranchEvent = new EventEmitter<any>();

  @Input() title: string;

  latitude: number;
  longitude: number;

  constructor() {
  }

  ngOnInit() {
  }

  show() {
    this.latitude = null;
    this.longitude = null;

    this.childModal.show();
  }

  hide() {
    this.childModal.hide();
  }

  onSaveChanges() {
    let data = {
      lat: this.latitude,
      lng: this.longitude
    };

    this.addBranchEvent.next(data);
    this.hide();
  }
}
