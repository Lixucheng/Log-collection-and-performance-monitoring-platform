import { Injectable } from '@angular/core';

@Injectable()
export default class DataService {
  public getList() {
    return [1, 2, 3, 4, 5, 6, 7];
  }
}
