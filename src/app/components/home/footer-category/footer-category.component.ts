import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-footer-category',
  templateUrl: './footer-category.component.html',
  styleUrls: ['./footer-category.component.scss']
})
export class FooterCategoryComponent implements OnInit {

  @Input() category:any={};
  constructor() { }

  ngOnInit(): void {
  }

}
