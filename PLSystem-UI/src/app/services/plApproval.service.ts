import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PLData } from '../models/PLData';

@Injectable({
  providedIn: 'root'
})
export class PlApprovalService {
  constructor(private http: HttpClient) {}

  getPLDetails(deskId, date): Observable<PLData> {
    return this.http.get<PLData>(
      environment.baseUrl +
        'api/pl/dailyPLTrades/' +
        deskId +
        '?businessDate=' +
        date
    );
  }

  approveTrade(plDesk: PLData): Observable<any> {
    return this.http.post(environment.baseUrl + 'api/pl', plDesk);
  }

  sendEmail(deskId, date): Observable<any> {
    return this.http.post(environment.baseUrl + 'api/pl/email/' +
    deskId +
    '?businessDate=' +
    date, {});
  }
}
