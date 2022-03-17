import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  cityDataSubject: any;
  cities: any = [];
  currentCity: any = {};

  constructor(private http: HttpClient) {
    if (JSON.parse(localStorage.getItem("currentCity")) != null) {
      this.currentCity = JSON.parse(localStorage.getItem("currentCity"))
    }
    this.cityDataSubject = new BehaviorSubject(this.currentCity);
  }

  getCity() {
    return this.http.get(environment.apiUrl + "city")
  }

  getState() {
    return this.http.get(environment.apiUrl + 'state');
  }

  getCitiesByStateName(stateName: any) {
    return this.http.get(environment.apiUrl + `cities?stateName=${stateName}`);
  }

  getSocietiesByCityId(cityId: any) {
    return this.http.get(environment.apiUrl + `society/bycity?cityId=${cityId}`);
  }

  getBlocksBySocietyId(societyId: any) {
    return this.http.get(environment.apiUrl + `block?societyId=${societyId}`);
  }

  getFlatsByBlockId(blockId: any, blockName: any) {
    return this.http.get(environment.apiUrl + `flat?societyId=${blockId}&blockName=${blockName}`);
  }

  checkAvailabilty(location: any) {
    return this.http.get(environment.apiUrl + `availability?lng=${location.lng}&lat=${location.lat}&areaId=${location.areaId}&area=${location.area}`);
  }

  filterAddressDetail(address_components, address) {
    for (var i = 0; i < address_components.length; i++) {
      for (var j = 0; j < address_components[i].types.length; j++) {
        if (address_components[i].types[j] == "locality") {
          address.city = address_components[i].long_name;
        }
        if (address_components[i].types[j] == "sublocality_level_1") {
          address.area = address_components[i].long_name;
        }
        if (address_components[i].types[j] == "administrative_area_level_2") {
          address.district = address_components[i].long_name;
        }
        if (address_components[i].types[j] == "administrative_area_level_1") {
          address.state = address_components[i].long_name;
        }
        if (address_components[i].types[j] == "country") {
          address.country = address_components[i].long_name;
        }
        if (address_components[i].types[j] == "postal_code") {
          address.pincode = address_components[i].long_name;
        }
        if (address_components[i].types[j] == "sublocality_level_2") {
          address.locality = address_components[i].long_name;
        }
        if (address_components[i].types[j] == "route") {
          address.route = address_components[i].long_name;
        }
        if (address_components[i].types[j] == "street_number") {
          address.street = address_components[i].long_name;
        }
        if (address_components[i].types[j] == "neighborhood") {
          address.neighbourhood = address_components[i].long_name;
        }
      }
    }
    return address;
  }

  get getCities() {
    return this.cities;
  }
  set setCities(citites: any) {
    this.cities = citites
  }

  get city() {
    return this.currentCity;
  }

  set city(city: any) {
    this.currentCity.id = city._id;
    this.currentCity.name = city.name;
    this.currentCity.serveAreaId = city.areaId
    this.currentCity.address = city.address
    this.currentCity.areaName = city.areaName
    this.currentCity.area = city.area
    localStorage.setItem("currentCity", JSON.stringify(this.currentCity))
    this.reloadProductData()
  }

  reloadProductData() {
    this.cityDataSubject.next(this.currentCity);
  }

  searchCity(location) {
    return this.http.get(environment.apiUrl + `searchcity?lat=${location.lat}&lng=${location.lng}&area=${location.area}`)
  }
}