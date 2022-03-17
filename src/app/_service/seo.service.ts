import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  metatitle: string = "Online Grocery Store: Buy Online Grocery from Noida, Ghaziabad Fast Delivery in 2 Hours at Discounted Rates | MorningBag";

  constructor(
    private title: Title,
    private meta: Meta) { }

  public addSeo(data: any): void {
    this.title.setTitle(data.metaTitle);
    this.meta.addTag({ name: 'keywords', content: data.metaKeywords.join() });
    this.meta.addTag({ name: 'description', content: data.metaDescription });
  }

  public removeMetaTags(data: any): void {
    this.meta.removeTag('name=keywords');
    this.meta.removeTag('name=description');
  }

  public updateSeo(data: any) {
    this.title.setTitle(data.metaTitle);
    this.meta.updateTag({ name: 'description', content: data.metaDescription });
    this.meta.updateTag({ name: 'keywords', content: Array.isArray(data.metaKeywords) ? data.metaKeywords.join() : data.metaKeywords });
  }

}
