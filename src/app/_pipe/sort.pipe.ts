import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any, args: any, searchTerm:any): any {
    if (value === null || value === '' || value === undefined) {
      return;
    }
    if (args === 'low to high') {
      if (searchTerm === 'price') {
        return value.sort((secondItem, firstItem) => {
          return secondItem.sellPrice - firstItem.sellPrice;
        });
      } else if (searchTerm === 'discount') {
        return value.sort((secondItem, firstItem) => {
          const firstItemdiscount = (100 - (firstItem.sellPrice / firstItem.price) * 100);
          const secondItemdiscount = (100 - (secondItem.sellPrice / secondItem.price) * 100);
          return secondItemdiscount - firstItemdiscount;
        });
      } else {
        return value;
      }
    }
    if (args === 'high to low') {
      if (searchTerm === 'price') {
        return value.sort((secondItem, firstItem) => {
          return firstItem.sellPrice - secondItem.sellPrice;
        });
      } else if (searchTerm === 'discount') {
        return value.sort((secondItem, firstItem) => {
          const firstItemdiscount = (100 - (firstItem.sellPrice / firstItem.price) * 100);
          const secondItemdiscount = (100 - (secondItem.sellPrice / secondItem.price) * 100);
          return firstItemdiscount - secondItemdiscount;
        });
      } else {
        return value;
      }
    }
    if (searchTerm === 'status') {
      return value.filter(transactions =>
        transactions.status.toLowerCase().indexOf(args.toLowerCase()) !== -1);
    }
    if (args === '') {
      return value;
    }
  }
}
