import { Component, OnInit } from '@angular/core';
import { IDesk } from '../models/IDesk';
import { ActivatedRoute } from '@angular/router';
import { PlApprovalService } from '../services/plApproval.service';
import { ConfigurationService } from '../services/configuration.service';
import { AuthService } from '../services/auth.service';
import { PortfolioView } from '../models/PortfolioView';
import { PortfolioTrade } from '../models/PortfolioTrade';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  desks: IDesk[] = [];
  deskPortfolios: PortfolioView[];
  selectedDeskDetails: PortfolioTrade[];
  selectedDesk: string;
  detailsAvailable = false;
  queryForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private plService: PlApprovalService,
    private configService: ConfigurationService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.queryForm = this.formBuilder.group({
      desk: ['', Validators.required]
    });
    if (this.authService.loggedIn()) {
      this.configService.getDesks().subscribe(resp => {
        this.desks = resp;
      });
      this.route.data.subscribe(data => {
        this.deskPortfolios = data.desks;
        this.selectedDeskDetails =
          this.deskPortfolios && this.deskPortfolios[0].portfolioTrades;
        this.queryForm.controls.desk.setValue(this.deskPortfolios[0].deskId);
        this.detailsAvailable = true;
      });
    }

    // this.plService.getAllDeskDetails().subscribe(res => {
    //   this.deskPortfolios = res;
    // });
  }

  getSelectedDeskDetails() {
    this.detailsAvailable = false;
    let details: PortfolioTrade[];
    this.deskPortfolios.forEach(elt => {
      if (elt.deskId === this.queryForm.get('desk').value) {
        details = elt.portfolioTrades;
        this.detailsAvailable = true;
      }
    });
    if (details.length <= 0) {
      this.alertify.warning('No data available for selected desk.');
    }
    this.selectedDeskDetails = details;
  }
}
