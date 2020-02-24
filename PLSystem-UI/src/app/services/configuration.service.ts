import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDesk } from '../models/IDesk';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  constructor(private http: HttpClient) {}
  getDesks(): Observable<IDesk[]> {
    return this.http.get<IDesk[]>(environment.baseUrl + 'api/configuration/desks');
  }

  getCommentaries(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + 'api/configuration/comments');
  }

}
