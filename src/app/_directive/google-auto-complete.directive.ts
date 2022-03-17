import { Directive, ElementRef, EventEmitter, Output,NgZone } from '@angular/core';
declare let google: any;
@Directive({
  selector: '[appGoogleAutoComplete]'
})
export class GoogleAutoCompleteDirective {
  @Output() onAddressChange: EventEmitter<any> = new EventEmitter();
  autocomplete: any;
  options:any={
    componentRestrictions: {country: "in"},
    // types: ["address","establishment"]
  }

  constructor(private el: ElementRef,
    private ngZone:NgZone) {
    this.autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement, this.options);
    this.autocomplete.addListener('place_changed', () => {
      this.fillInAddress()
    });
  }

  fillInAddress() {
    let place = this.autocomplete.getPlace();
    this.ngZone.run(()=>{
      if (place && place.place_id) {
        this.onAddressChange.emit(place);
      }
    })
  }

}
