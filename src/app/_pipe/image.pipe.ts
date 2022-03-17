import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args === 'cat') { 
      return `${environment.apiUrl}public/cat/${value}`;
    } else if (args === 'city') {
      return `${environment.apiUrl}public/city/${value.replace(/ /g, '-')}`;
    } else if (args === 'notification') {
      return `${environment.apiUrl}public/notification/${value.replace(/ /g, '-')}`;
    } else if (args === 'membership') {
      return `${environment.apiUrl}public/membership/${value.replace(/ /g, '-')}`;
    } else if (args === 'banners') {
      return `${environment.apiUrl}public/banner/${value.toString().replace(/ /g, '-')}`;
    } else {
      if (value) {
        return `${environment.apiUrl}public/product/${value}`;
      }
    }
  }

}
