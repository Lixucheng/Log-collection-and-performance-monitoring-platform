import { Injectable } from '@angular/core';
import fetch from 'helpers/fetch';

@Injectable()
export default class DataService {
  public getLogList(deviceId) {
    return fetch(`/api/log/list/${deviceId}`);
  }
}
