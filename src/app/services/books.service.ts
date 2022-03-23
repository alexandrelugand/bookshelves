import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DatabaseReference } from '@angular/fire/compat/database/interfaces';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Subject, tap } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  constructor(
    private afDb: AngularFireDatabase,
    private afStorage: AngularFireStorage
  ) { }

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  saveBooks() {
    this.afDb.database.ref('/books').set(this.books);
  }

  getBooks() {
    this.afDb.database.ref('/books')
      .on('value', (data) => {
        this.books = data.val() ? data.val() : [];
        this.emitBooks();
      });
  }

  getSingleBook(id: number) {
    return new Promise<Book>(
      (resolve, reject) => {
        this.afDb.database.ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewBook(book: Book) {
    this.books.push(book);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {

    if (book.photo) {
      const imageRef = this.afStorage.refFromURL(book.photo);
      imageRef.delete().subscribe({
        next: () => {
          console.log('File deleted!');
        },
        error: (error) => {
          console.log('Can\'t delete file: ' + error);
        }
      });
    }

    const bookIndex = this.books.findIndex(
      (b) => {
        if (b == book) {
          return true;
        }
        return false;
      }
    );

    this.books.splice(bookIndex, 1);
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {
    return new Promise<string>(
      (resole, reject) => {
        const filePath = `images/${new Date().getTime()}_${file.name}`;
        const imageRef = this.afStorage.ref(filePath);
        const uploadTask = this.afStorage.upload(filePath, file);

        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            imageRef.getDownloadURL().subscribe({
              next: (url) => {
                resole(url);
              },
              error: (error) => {
                reject(error);
              }
            })
          })
        ).subscribe();
      }
    );
  }
}
