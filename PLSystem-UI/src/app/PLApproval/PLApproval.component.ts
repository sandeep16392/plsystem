import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { saveAs } from 'file-saver';
import { IDesk } from '../models/IDesk';
import { PlApprovalService } from '../services/plApproval.service';
import { ConfigurationService } from '../services/configuration.service';
import { PLData } from '../models/PLData';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertifyService } from '../services/alertify.service';

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
  type: number;

  public fileOptions = [
    { value: 0, id: 'PDF', disabled: false },
    { value: 1, id: 'CSV', disabled: false },
    { value: 2, id: 'Excel', disabled: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private plService: PlApprovalService,
    private configService: ConfigurationService,
    private formBuilder: FormBuilder,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.desks = data.desks;
    });
    // this.configService.getDesks().subscribe(resp => {
    //   this.desks = resp;
    // });
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
          if (error.status == 404) {
            this.isFound = false;
            this.error = error.error.message;
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
    this.alertify.confirm('Are you sure about approval?', () => {
      this.plData.explainedVariance = +this.plData.explainedVariance;
      this.plService.approveTrade(this.plData).subscribe(resp => {
        if (resp) {
          this.alertify.success('Approved!');
        }
      });
    });
  }

  sendEmail() {
    this.alertify.confirm('Send email to Front Office?', () => {
      this.plService
        .sendEmail(
          this.queryForm.get('desk').value,
          this.queryForm.get('businessDate').value
        )
        .subscribe(
          res => {
            this.alertify.success(res.message);
          },
          err => {
            this.alertify.error('Email Failure');
          }
        );
    });
  }

  downloadFile() {
    this.alertify.confirm('Download File?', () => {
      this.plService
        .downloadFile(
          this.type,
          this.queryForm.get('desk').value,
          this.queryForm.get('businessDate').value
        )
        .subscribe(
          res => {
            const blob = new Blob([res], { type: 'application/octet-stream' });
            const fileName = 'desk.csv';
            saveAs(blob, fileName);
            this.alertify.success('File Downloaded.');
          },
          err => {
            this.alertify.error('File Download failed!');
          }
        );
    });
  }
}
