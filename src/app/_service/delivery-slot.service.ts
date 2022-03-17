import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { LocationService } from 'src/app/_service/location.service';

@Injectable({
  providedIn: 'root'
})
export class DeliverySlotService {

  slot: any = { time: "" };
  slots: any = { slotList: [] };
  params:any={}
  public deliveryCharges: any = {}

  constructor(
    private http: HttpClient,
    private _LS: LocationService
  ) {
    this._LS.cityDataSubject.subscribe((city: any) => {
      if(city.id){
        this.params.cityId=city.id
        this.params.areaId=this.areaId ? this.areaId  : ""
        this.params.date=new Date()
        this.getTimeSlots(this.params);
        this.getDeliveryCharge()
      }
    })
  }

  getDeliveryCharge(){
    this.getDeliverySettings().subscribe(data => {
      let deliveryCharges: any = data;
      this.deliveryCharges = deliveryCharges.setting;
    })
  }

  getTimeSlots(param) {
    this.http.get(environment.apiUrl + `timeslot`,{params:param}).subscribe((response: any) => {
      if (response.success) {
        this.slots.slotList = response.timeslot;
        this.slots.isDisableSlot = response.disableSlotMsg ? true : false
        this.slot.time = response.nextDeliverySlot;
      }
    });
  }

  getSlot() {
    return this.slot;
  }

  get deliverySlots() {
    return this.slots;
  }

  getDeliverySettings() {
    return this.http.get(environment.apiUrl + 'delivery/charge',{params:this.params});
  }

  get areaId(){
    return JSON.parse(localStorage.getItem('currentCity')).serveAreaId
  }

  getSlots(param){
    return this.http.get(environment.apiUrl+'timeslot',{params:param})
  }
}
