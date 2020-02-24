import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private route: Router
  ) {}

  ngOnInit() {}

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authService.currentUser = null;
    this.authService.decodedToken = null;
    this.alertify.message('Logged Out!');
    this.route.navigate(['/home']);
  }
}
