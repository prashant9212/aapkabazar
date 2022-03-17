import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/_service/index';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-category',
  templateUrl: './all-category.component.html',
  styleUrls: ['./all-category.component.scss']
})
export class AllCategoryComponent implements OnInit {

  constructor(
    private _CS: CategoryService,
  ) { }
  categoryDataSubscription: Subscription;

  rootCategories: any = [];

  ngOnInit(): void {
    this.categoryDataSubscription = this._CS.rootCategoryDataSubject.subscribe(data => {
      this.rootCategories = data;
    })
  }

  ngOnDestroy() {
    this.categoryDataSubscription.unsubscribe();
  }

}
