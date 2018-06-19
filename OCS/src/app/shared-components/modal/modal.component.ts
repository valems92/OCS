import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @ViewChild('childModal') public childModal: ModalDirective;
  @Output() closeEvent = new EventEmitter<any>();
  @Input() title: string;
  @Input() content: string;

  constructor() {
  }

  ngOnInit() {
  }

  show() {
    this.childModal.show();
  }

  onOK() {
    this.closeEvent.next(true);
    this.hide();
  }

  onCancel() {
    this.closeEvent.next(false);
    this.hide();
  }

  hide() {
    this.childModal.hide();
  }
}
