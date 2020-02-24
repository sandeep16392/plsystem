import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { IDesk } from '../models/IDesk';
import { PlApprovalService } from '../services/plApproval.service';
import { ConfigurationService } from '../services/configuration.service';
import { PLData } from '../models/PLData';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './PLApproval.component.html',
  styleUrls: ['./PLApproval.component.scss']
})
export class PLApprovalComponent implements OnInit {
  desks: IDesk[] = [];
  businessDate: Date;
  selectedValue: string;
  selectedDesk: IDesk;
  dataReceived = false;
  plData: PLData;
  explainedVariance: number;
  comments: any;
  isFound = true;
  error: string;
  queryForm: FormGroup;
  plForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private plService: PlApprovalService,
    private configService: ConfigurationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // this.route.data.subscribe(data => {
    //   this.desks = data.desks;
    // });
    this.configService.getDesks().subscribe(resp => {
      this.desks = resp;
    });
    this.configService.getCommentaries().subscribe(resp => {
      this.comments = resp;
    });
    this.queryForm = this.formBuilder.group({
      desk: ['', Validators.required],
      businessDate: ['', Validators.required]
    });
  }

  getPLDetails() {
    this.dataReceived = false;
    this.plService
      .getPLDetails(
        this.queryForm.get('desk').value,
        this.queryForm.get('businessDate').value
      )
      .subscribe(
        resp => {
          this.plData = resp;
          this.plData.unExplainedVariance =
            this.plData.variance - this.plData.explainedVariance;
          this.dataReceived = true;
          console.log(resp);
        },
        error => {
          console.log(error);
          if (error.status == 404) {
            this.isFound = false;
            this.error = error.error;
          }
        }
      );
  }

  onVarianceChange() {
    this.plData.unExplainedVariance =
      this.plData.variance - this.plData.explainedVariance;
  }

  onDeskChange(newDesk) {
    const items = this.desks.filter(e => {
      return e.deskId === this.selectedValue;
    });
    this.selectedDesk = items[0];
  }

  onSubmit() {
    if (confirm('Are you sure about approval?')) {
      this.plData.explainedVariance = +this.plData.explainedVariance;
      this.plService.approveTrade(this.plData).subscribe(resp => {
        if (resp) {
          alert('Approved!');
        }
      });
    }
  }

  sendEmail() {
    if (confirm('Send email to Front Office?')) {
      this.plService
        .sendEmail(
          this.queryForm.get('desk').value,
          this.queryForm.get('businessDate').value
        )
        .subscribe(
          res => {
            alert(res.message);
          },
          err => {
            alert(err.error.message);
          }
        );
    }
  }
}
