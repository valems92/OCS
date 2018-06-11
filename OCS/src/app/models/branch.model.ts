export class Branch {
  public id: string;
  public lat: number;
  public lng: number;
  public title: string;

  constructor(id: string, lat: number, lng: number, title: string) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.title = title;
  }
}
