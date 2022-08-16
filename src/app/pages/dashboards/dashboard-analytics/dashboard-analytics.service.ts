import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardAnalyticsService {

  constructor(public http: HttpClient) { }

  getShareData(timeIs: String, symbol: String, interval: String) {
    console.log(timeIs);
    return this.http.get('https://www.alphavantage.co/query?function=' + timeIs + '&symbol=' + symbol + '&interval=' + interval + '&apikey=2T3YFBT54440FFWW').toPromise();
  }
}
