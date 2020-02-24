import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { IDesk } from '../models/IDesk';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';

@Injectable()
export class ConfigResolver implements Resolve<IDesk[]> {
    constructor(
        private configService: ConfigurationService,
        private router: Router,
        ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IDesk[]> {
        return this.configService.getDesks();
    }
}
