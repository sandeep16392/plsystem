import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDesk } from '../models/IDesk';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }
  getDesks(): Observable<IDesk[]> {
    return this.http.get<IDesk[]>(environment.baseUrl + 'api/configuration/' + this.authService.currentUser.userName + '/desks');
  }

  getCommentaries(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + 'api/configuration/' + this.authService.currentUser.userName + '/comments');
  }

}
