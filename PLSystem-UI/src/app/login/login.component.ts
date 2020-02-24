import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model = {username: '', password: ''};

  constructor(private router: Router,
              public authService: AuthService,
              private alertify: AlertifyService,
              private route: Router) { }

  ngOnInit() {
  }
  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertify.success('Logged In!');
        this.route.navigate(['/home']);
      },
      error => {
        this.alertify.error(error);
      }, () => {
        this.route.navigate(['/home']);
      }    );
  }
  cancel() {
    this.router.navigate(['/home']);
  }

}
