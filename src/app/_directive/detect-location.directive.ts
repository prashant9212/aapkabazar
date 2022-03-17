import { Directive, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';
declare let google: any;
@Directive({
  selector: '[appDetectLocation]'
})
export class DetectLocationDirective {
  @Output() onLocationDetected: EventEmitter<any> = new EventEmitter();
  geocoder:any;

  constructor(
    private el:ElementRef,
    private ngZone:NgZone
    ) {
    this.geocoder = new google.maps.Geocoder;
    this.el.nativeElement.addEventListener('click',()=>{
      this.getAddress();
    })
  }

  getAddress(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        let geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.geocoder.geocode({location:geolocation},(result,status)=>{
          this.ngZone.run(()=>{
            if(status==="OK"){
              this.onLocationDetected.emit(result[0])
            }
          })
        })
      });
    }
  }
}
