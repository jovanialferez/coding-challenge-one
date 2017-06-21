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
    if (this.properties.length == 0) {
      return this.http
        .post('http://localhost:8000/api/Property/availableProperties', {})
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

        for (let tag of tags) {
          if (item.defaultImage.labels[tag]) return true;
        }

        return false;
      });

      return Observable.of(properties);
    }

    return Observable.of([]);
  }

  getTags(q: string): string[] {
    // return this.tags.filter(tag => tag.indexOf(q) !== -1); // anhywhere
    return this.tags.filter(tag => tag.indexOf(q) === 0); // starts with
  }
}
