import { Component, OnInit } from '@angular/core';
import { IDesk } from '../models/IDesk';
import { ActivatedRoute } from '@angular/router';
import { PlApprovalService } from '../services/plApproval.service';
import { ConfigurationService } from '../services/configuration.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  desks: IDesk[] = [];

  constructor(
    private route: ActivatedRoute,
    private plService: PlApprovalService,
    private configService: ConfigurationService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.configService.getDesks().subscribe(resp => {
      this.desks = resp;
    });
  }
}
