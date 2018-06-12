import {Component, OnInit, ViewChild} from '@angular/core';
import {} from '@types/googlemaps';
import {BranchService} from "../services/BranchService";
import {Branch} from "../models/branch.model";
import {AlertComponent} from "../shared-components/alert/alert.component";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})


export class AboutUsComponent implements OnInit {
  @ViewChild(AlertComponent) childAlert: AlertComponent;
  @ViewChild('gMap') gMapElement: any;
  map: google.maps.Map = null;

  branches: Branch[] = [];

  constructor(private branchService: BranchService) {
    branchService.branchesChangeEvent.subscribe((value) => {
      this.branches = value;

      this.addMarkers();
    });
  }

  ngOnInit() {
    this.branches = this.branchService.allBranches;
  }

  initMap(branch) {
    let lat = branch ? branch.lat : 0;
    let lng = branch ? branch.lng : 0;

    let mapProp = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.gMapElement.nativeElement, mapProp);

    this.addMarkers();
  }

  addMarkers() {
    if (this.map) {
      for (let i = 0; i < this.branches.length; i++) {
        let branch = this.branches[i];

        new google.maps.Marker({
          map: this.map,
          position: {lat: branch.lat, lng: branch.lng},
          title: branch.title
        });
      }
    } else {
      this.initMap(this.branches[0]);
    }
  }
}
