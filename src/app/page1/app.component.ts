import { Component } from '@angular/core';
import DataService from 'service/get-list';
@Component({
  selector: 'page1',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DataService],
})
export default class AppComponent {
  title = 'page1';
  list: number[];
  constructor(private dataService: DataService){
    this.list = dataService.getList();
    console.log(this.list);
  }
}
