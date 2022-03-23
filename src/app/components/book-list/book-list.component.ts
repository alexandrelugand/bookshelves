import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/book.model';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, OnDestroy {

  books!: Book[];
  bookSubscription!: Subscription;

  constructor(
    private boolService: BooksService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.bookSubscription = this.boolService.booksSubject.subscribe({
      next: (books) => {
        this.books = books;
      }
    });
    this.boolService.getBooks();
    this.boolService.emitBooks();
  }

  onNewBook() {
    this.router.navigate(['/books', 'new'])
  }

  onDeleteBook(book: Book) {
    this.boolService.removeBook(book);
  }

  onViewBook(id: number) {
    this.router.navigate(['/books', 'view', id])
  }

  ngOnDestroy(): void {
    this.bookSubscription.unsubscribe();
  }
}
