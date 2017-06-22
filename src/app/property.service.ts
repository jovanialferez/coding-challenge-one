import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class PropertyService {
  private tags: string[];
  private properties: any[];
  constructor(private http: Http) { 
    this.tags = [];
    this.properties = [];
  }

  getAvailableProperties(tags?: string[]): Observable<any[]> {
    // fetch if we dont have it yet
    if (this.properties.length == 0) {
       // with this live endpoint, browser is sending pre-flight CORS and causing request error
      return this.http
        .post('http://www.onerent.co/api/Property/availableProperties', {})
        .map((response:Response) => {
          this.properties = response.json();
          for (let i = 0; i < this.properties.length; i++) {
            let item = this.properties[i];
            if (!item.defaultImage) continue;
            // labels are the keys, so `for..in`
            for (let label in item.defaultImage.labels) {
              if (this.tags.indexOf(label) === -1) {
                this.tags.push(label);
              }
            }
          }
          return this.properties;
        })
    }
    
    if (tags && tags.length) {
      let properties = this.properties.filter(item => {
        if (!item.defaultImage) return false;

        // a single match should do
        for (let tag of tags) {
          if (item.defaultImage.labels[tag]) return true;
        }

        return false;
      });

      // makes sense to add up the confidence ratings
      // and use it for sorting
      properties.map(item => {
        item.totalRatings = 0;
        for (let tag of tags) {
          if (item.defaultImage.labels[tag]) item.totalRatings += item.defaultImage.labels[tag];
        }
      });

      // highest ratings first
      properties.sort((a, b) => {
        return b.totalRatings - a.totalRatings;
      })

      return Observable.of(properties);
    }

    // tags is empty, return all the properties
    return Observable.of(this.properties);
  }

  getTags(q: string): string[] {
    // return this.tags.filter(tag => tag.indexOf(q) !== -1); // anhywhere
    return this.tags.filter(tag => tag.indexOf(q) === 0); // starts with
  }
}
