import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth!: boolean;

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe({
      next: (user) => {
        if (user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    })
  }

  onSignOut() {
    this.authService.signOutUser();
  }
}
