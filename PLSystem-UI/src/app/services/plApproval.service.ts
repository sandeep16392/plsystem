import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PLData } from '../models/PLData';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlApprovalService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }
  getPLDetails(deskId, date): Observable<PLData> {
    return this.http.get<PLData>(
      environment.baseUrl +
        'api/pl/' + this.authService.currentUser.userName + '/dailyPLTrades/' +
        deskId +
        '?businessDate=' +
        date
    );
  }

  approveTrade(plDesk: PLData): Observable<any> {
    return this.http.post(environment.baseUrl + 'api/pl' + this.authService.currentUser.userName, plDesk);
  }

  sendEmail(deskId, date): Observable<any> {
    return this.http.post(environment.baseUrl + 'api/pl/' + this.authService.currentUser.userName + '/email/' +
    deskId +
    '?businessDate=' +
    date, {});
  }

  downloadFile(type, deskId, date): Observable<any> {
    return this.http.get(environment.baseUrl  + 'api/pl/' + this.authService.currentUser.userName + '/file/' +
    deskId + '/' + type +
    '?businessDate=' +
    date);
  }
}
