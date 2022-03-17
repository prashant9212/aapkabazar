import { Directive, ElementRef, Output ,EventEmitter} from '@angular/core';
 
declare let google: any;

@Directive({
  selector: '[appCityGoogleAutocomplete]'
})
export class CityGoogleAutocompleteDirective {
@Output() onAddressSelect : EventEmitter<any> = new EventEmitter()
autoComplete:any;
options:any={
  componentRestrictions: {country: "in"},
}

  constructor(private el: ElementRef,) {
    this.autoComplete = new google.maps.places.Autocomplete(this.el.nativeElement,this.options)
    this.autoComplete.addListener('place_changed', () => {
      // let places = this.autoComplete.getPlace().geometry.location
      let places = this.autoComplete.getPlace()
      this.onAddressSelect.emit(places)
    });
   }

}
