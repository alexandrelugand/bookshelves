import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  createNewUser(email: string, password: string) {
    return new Promise<any>(
      (resolve, reject) => {
        this.afAuth.createUserWithEmailAndPassword(email, password).then(
          () => {
            resolve(true);
          },
          (error: any) => {
            reject(error);
          });
      }
    );
  }

  signInUser(email: string, password: string) {
    return new Promise<any>(
      (resolve, reject) => {
        this.afAuth.signInWithEmailAndPassword(email, password).then(
          () => {
            resolve(true);
          },
          (error: any) => {
            reject(error.message);
          });
      }
    );
  }

  signOutUser() {
    this.afAuth.signOut();
  }
}
