import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { IDesk } from '../models/IDesk';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../services/configuration.service';
import { PortfolioView } from '../models/PortfolioView';
import { PlApprovalService } from '../services/plApproval.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class DeskResolver implements Resolve<PortfolioView[]> {
    constructor(
        private plService: PlApprovalService,
        private router: Router,
        private authService: AuthService
        ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<PortfolioView[]> {
        if (this.authService.loggedIn()) {
        return this.plService.getAllDeskDetails();
        }
    }
}
