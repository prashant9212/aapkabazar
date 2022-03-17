import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageSize'
})
export class ImageSizePipe implements PipeTransform {

  transform(value: String, ...args: Number[]): unknown {
    if(value){
      // let image = value.split(".")
      // return `${image[0]}-${args[0]}x${args[0]}.${image[1]}`;
      return value;
    }else{
      return '';
    }
  }

}
