import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { PropertyService } from './property.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private properties: any[];
  private currentTags: string[];
  private tags: Observable<string[]>;
  private tagsFilter: Subject<string>;
  constructor(private propertyService: PropertyService) {
    this.currentTags = [];
    this.tagsFilter = new Subject<string>();
  }

  ngOnInit() {

    this.tags = this.tagsFilter
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term ? Observable.of(this.propertyService.getTags(term)): Observable.of([]));
    this.propertyService
      .getAvailableProperties()
      .subscribe(properties => this.properties = properties);
  }

  filter(tag:string) {
    this.tagsFilter.next(tag);
  }

  addTag(tag:string) {
    if (this.currentTags.indexOf(tag) === -1) {
      this.currentTags.push(tag);
    }
    this.tagsFilter.next(''); // reset the sugggestions

    this.propertyService
      .getAvailableProperties(this.currentTags)
      .subscribe(properties => this.properties = properties);
  }
}
