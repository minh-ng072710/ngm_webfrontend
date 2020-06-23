import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { auth } from 'firebase'
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  uid = this.afAuth.authState.pipe(
    map(auState => {
      if (!auState) {
        return null
      } else {
        return auState.uid
      }
    })
  );
  isAdmin = observableOf(true);
  private dbPath = '/user';
  userRef: AngularFirestoreCollection<User> = null;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {
    this.userRef = db.collection(this.dbPath);
  }
  creatUser(user: User): void {
    this.userRef.add({ ...user });
  }
  updateUser(key: string, value: any): Promise<void> {
    return this.userRef.doc(key).update(value);

  }
  deleteUser(key: string): Promise<void> {
    console.log(key)
    return this.userRef.doc(key).delete();
  }
  getUserList(): AngularFirestoreCollection<User> {
    return this.userRef;
  }
  deleteAll() {
    this.userRef.get().subscribe(
      querySnapshot => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      },
      err => {
        console.log("Error: ", err)
      }
    )
  }
  login() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(res => {
        window.location.href = "/cate" //Hàm resolve returns a Promise object that is resolved with a given value
      }, err => {
        console.log(err);
      });
  }
  logout() {
    this.afAuth.signOut()
  }
}
