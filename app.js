const modal = document.querySelector('.modal');
const addBtn = document.querySelector('.add-btn');
const closeModalBtn = document.querySelector('.close-modal-btn');
const addItem = document.querySelector('.add-item');

addBtn.addEventListener('click', () => {
  modal.classList.add('active');
  addItem.classList.add('toggle');
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  addItem.classList.remove('toggle');
});

class Book {
  constructor(title, author, lang, pages, status) {
    this.title = title;
    this.author = author;
    this.lang = lang;
    this.pages = pages;
    this.status = Boolean(status);
  }
}

Book.prototype.published = undefined;
Book.prototype.subject = undefined;

const bookShelf = document.querySelector('.bookshelf');
const myLibrary = [];

function createBook(book) {
  const newBook = document.createElement('div');
  newBook.dataset.index = myLibrary.indexOf(book);
  bookShelf.appendChild(newBook);
  newBook.classList.add('book');

  // control buttons

  const controlDiv = document.createElement('div');
  newBook.appendChild(controlDiv);
  controlDiv.classList.add('control');

  const editBtn = document.createElement('button');
  controlDiv.appendChild(editBtn);
  editBtn.classList.add('edit');

  const editBtnImg = document.createElement('img');
  editBtn.appendChild(editBtnImg);
  editBtnImg.src = 'icon/edit_FILL0_wght400_GRAD0_opsz48.svg';
  editBtnImg.alt = 'edit button';

  const closeBtn = document.createElement('button');
  controlDiv.appendChild(closeBtn);
  closeBtn.classList.add('close');

  const closeBtnImg = document.createElement('img');
  closeBtn.appendChild(closeBtnImg);
  closeBtnImg.src = 'icon/close.svg';
  closeBtn.alt = 'close button';

  // book info

  const bookInfo = document.createElement('div');
  newBook.appendChild(bookInfo);
  bookInfo.classList.add('book-info');

  const title = document.createElement('p');
  bookInfo.appendChild(title);
  title.classList.add('title');
  title.textContent = `${book.title}`;

  const author = document.createElement('p');
  bookInfo.appendChild(author);
  author.classList.add('author');
  author.textContent = `By ${book.author}`;

  const lang = document.createElement('p');
  bookInfo.appendChild(lang);
  lang.classList.add('lang');
  lang.textContent = `Language : ${book.lang}`;

  const pages = document.createElement('p');
  bookInfo.appendChild(pages);
  pages.classList.add('pages');
  pages.textContent = `Page : ${book.pages}`;

  if (book.published) {
    const published = document.createElement('p');
    bookInfo.appendChild(published);
    published.classList.add('published');
    published.textContent = `Published : ${book.published}`;
  }

  if (book.subject) {
    const subject = document.createElement('p');
    bookInfo.appendChild(subject);
    subject.classList.add('subject');
    subject.textContent = `Subject : ${book.subject}`;
  }

  // toggle button

  const read = document.createElement('div');
  newBook.appendChild(read);
  read.classList.add('read');

  const input = document.createElement('input');
  read.appendChild(input);
  input.type = 'checkbox';
  input.name = 'mark-read';
  input.id = `mark-read-${myLibrary.indexOf(book)}`;
  input.checked = book.status;

  const label = document.createElement('label');
  read.appendChild(label);
  label.htmlFor = `mark-read-${myLibrary.indexOf(book)}`;

  const span1 = document.createElement('span');
  label.appendChild(span1);
  span1.textContent = `Mark as Read`;

  const span2 = document.createElement('span');
  label.appendChild(span2);
}

const bookForm = document.querySelector('.book-form');

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const lang = document.getElementById('lang').value;
  const pages = document.getElementById('pages').value;
  const publishDate = document.getElementById('published').value;
  const subject = document.getElementById('subject').value;
  const status = document.getElementById('mark-read-form').checked;

  const book = new Book(title, author, lang, pages, status);
  book.published = publishDate;
  book.subject = subject;

  myLibrary.push(book);

  bookForm.reset();

  modal.classList.remove('active');
  addItem.classList.remove('toggle');

  createBook(book);
});
