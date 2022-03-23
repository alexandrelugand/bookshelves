import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book.model';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  bookForm!: FormGroup;
  fileIsUploading = false;
  fileUrl!: string;
  fileError!: string;
  fileUploaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private bookService: BooksService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
    });
  }

  onSaveBook() {
    const title = this.bookForm.get('title')?.value;
    const author = this.bookForm.get('author')?.value;
    const book = new Book(title, author);
    if (this.fileUrl && this.fileUrl !== '') {
      book.photo = this.fileUrl;
    }
    this.bookService.createNewBook(book);
    this.router.navigate(['/books']);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.bookService.uploadFile(file).then(
      (url) => {
        this.fileUrl = url;
        this.fileUploaded = true;
      },
      (error) => {
        this.fileError = error.message;
      })
      .finally(() => {
        this.fileIsUploading = false;
      });
  }

  detectFiles(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      const fileList = target.files as FileList;
      if (fileList) {
        this.onUploadFile(fileList[0]);
      }
    }
  }
}
