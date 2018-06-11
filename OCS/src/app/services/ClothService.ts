import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from "@angular/common/http";
import {Cloth} from "../models/cloth.model";
import {UserService} from "./UserService";

@Injectable()
export class ClothService {
    allClothes: Cloth[] = [];
    clothesByProvider: any = {};
    filterData: any = {
        providers: [],
        colors: [],
        maxPrice: 0
    };

    filterSelected: any = null;
    filteredCloth: Cloth[] = [];


    filterDataChangeEvent: Subject<any> = new Subject<any>();
    allClothesChangeEvent: Subject<Cloth[]> = new Subject<Cloth[]>();
    clothesByProviderChangeEvent: Subject<any> = new Subject<any>();

    constructor(private userService: UserService, private http: HttpClient) {
        this.http.get("http://localhost:3000/catalog/getClothes").subscribe(
            res => {
                let clothes;
                if (res["rows"]) {
                    clothes = res["rows"];
                    for (let i = 0; i < clothes.length; i++) {
                        let cloth = clothes[i].doc;
                        this.handleEachClothes(cloth);
                    }
                    this.change();
                } else {
                    clothes = res;
                    for (let i in clothes) {
                        let cloth = clothes[i];
                        this.handleEachClothes(cloth);
                    }

                    this.change();
                }
            },
            err => {
                console.log("There was an error getting the catalog");
            }
        );
    }

    handleEachClothes(cloth) {
        let provider = cloth.provider.toLowerCase();
        let clothObj = new Cloth(cloth._id, provider, cloth.description, cloth.imagePath, cloth.price, cloth.color);
        this.allClothes.push(clothObj);
        this.addClothToProvider(provider, clothObj);
        this.addFilterData(clothObj);
    }

    addClothToFilteredCloth(provider, clothObj) {
        if (this.filterSelected) {
            let match = this.isClothMatchFilter(provider, clothObj);
            if (match)
                this.filteredCloth.push(clothObj);
        }
    }

    isClothMatchFilter(provider, clothObj) {
        let providerMatch = false;
        let colorMatch = false;
        let priceMatch = false;

        if (this.filterSelected.provider === "All" || provider === this.filterSelected.provider)
            providerMatch = true;

        if (this.filterSelected.color === "All" || this.filterSelected.color === clothObj.color)
            colorMatch = true;

        if (clothObj.price <= this.filterSelected.maxPrice)
            priceMatch = true;

        return providerMatch && colorMatch && priceMatch
    }

    addClothToProvider(provider, clothObj) {
        if (!this.clothesByProvider[provider]) {
            this.clothesByProvider[provider] = [];
        }

        this.clothesByProvider[provider].push(clothObj);
    }

    addFilterData(clothObj) {
        if (this.filterData.providers.indexOf(clothObj.provider) === -1)
            this.filterData.providers.push(clothObj.provider);

        if (this.filterData.colors.indexOf(clothObj.color) === -1)
            this.filterData.colors.push(clothObj.color);

        if (this.filterData.maxPrice < clothObj.price)
            this.filterData.maxPrice = clothObj.price;
    }

    filterCloth(provider, color, maxPrice) {
        this.filteredCloth = [];

        if (provider === "All" && color === "All" && maxPrice === this.filterData.maxPrice) {
            if (this.filterSelected) {
                this.allClothesChangeEvent.next(this.allClothes);
            }
            this.filterSelected = null;
        } else {
            this.filterSelected = {
                provider: provider,
                color: color,
                maxPrice: maxPrice
            };

            for (let i = 0; i < this.allClothes.length; i++) {
                let cloth = this.allClothes[i];
                this.addClothToFilteredCloth(cloth.provider, cloth);
            }

            this.allClothesChangeEvent.next(this.filteredCloth);
        }
    }

    addCloth(provider, clothObj) {
        this.allClothes.push(clothObj);
        this.addClothToProvider(provider, clothObj);
        this.addClothToFilteredCloth(provider, clothObj);
        this.addFilterData(clothObj);

        this.change();
    }

    addNewCloth(cloth, cb) {
        let headers = this.userService.getHeaders();
        this.http.post("http://localhost:3000/catalog/storeCloth", cloth, {headers: headers})
            .subscribe(
                res => {
                    let clothId = res["id"];
                    let clothObj = new Cloth(clothId, cloth.provider.toLowerCase(), cloth.description, cloth.imagePath, cloth.price, cloth.color);

                    this.addCloth(clothObj.provider, clothObj);
                    cb({status: "success"});
                },
                err => {
                    cb({status: "error", message: err.error.message});
                }
            );
    }

    getCloth(id, cb) {
        this.http.get("http://localhost:3000/catalog/getCloth/" + id)
            .subscribe(
                res => {
                    cb({status: "success", cloth: res});
                },
                err => {
                    cb({status: "error", message: err.error.message});
                }
            );
    }

    updateCloth(data, cb) {
        let headers = this.userService.getHeaders();
        this.http.post("http://localhost:3000/catalog/updateCloth", data, {headers: headers})
            .subscribe(
                res => {
                    let clothId = data.id;
                    let cloth = data.cloth;
                    let clothObj = new Cloth(clothId, cloth.provider.toLowerCase(), cloth.description, cloth.imagePath, cloth.price, cloth.color);

                    this.updateAll(clothId, clothObj);
                    cb({status: "success"});
                },
                err => {
                    cb({status: "error", message: err.error.message});
                }
            );
    }

    updateAll(id, clothObj) {
        let oldProvider;

        for (let i = 0; i < this.allClothes.length; i++) {
            if (this.allClothes[i].id === id) {
                oldProvider = this.allClothes[i].provider;
                if (clothObj)
                    this.allClothes[i] = clothObj;
                else
                    this.allClothes.splice(i, 1);
                break;
            }
        }

        if (this.clothesByProvider[oldProvider]) {
            for (let i = 0; i < this.clothesByProvider[oldProvider].length; i++) {
                if (this.clothesByProvider[oldProvider][i].id === id) {
                    this.clothesByProvider[oldProvider].splice(i, 1);
                    break;
                }
            }
        }
        if (clothObj)
            this.addClothToProvider(clothObj.provider, clothObj);

        this.change();
    }

    deleteCloth(id, cb) {
        let headers = this.userService.getHeaders();
        this.http.delete("http://localhost:3000/catalog/auth/deleteCloth/" + id, {headers: headers}).subscribe(
            res => {
                this.updateAll(id, null);
                cb({status: "success"});
            },
            err => {
                cb({status: "error", message: err.error.message});
            }
        );
    }

    change() {
        this.allClothesChangeEvent.next((this.filterSelected) ? this.filteredCloth : this.allClothes);
        this.clothesByProviderChangeEvent.next(this.clothesByProvider);
        this.filterDataChangeEvent.next(this.filterData);
    }
}
