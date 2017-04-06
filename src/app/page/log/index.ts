import { Component } from '@angular/core';
import DataService from 'src/service/log';
@Component({
  selector: 'page1',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
  providers: [DataService],
})
export default class AppComponent {
  private list: string[];
  constructor(private dataService: DataService) {
    dataService.getLogList('electron').then((data: string[]) => this.list = data);
  }
  private onClick() {
    console.log(this.list);
  }
}
