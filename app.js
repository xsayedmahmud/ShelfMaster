const modal = document.querySelector('.modal');
const addBtn = document.querySelector('.add-btn');
const closeModalBtn = document.querySelector('.close-modal-btn');
const addItem = document.querySelector('.add-item');
const bookForm = document.querySelector('.book-form');
const getById = (id) => document.getElementById(id);
const bookShelf = document.querySelector('.bookshelf');
let myLibrary = [];

addBtn.addEventListener('click', () => {
  modal.classList.add('active');
  addItem.classList.add('toggle');
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  addItem.classList.remove('toggle');
  bookForm.dataset.action = 'add';
  delete bookForm.dataset.bookIndex;
  bookForm.reset();
});

class Book {
  constructor(title, author, lang, pages, status, published, subject) {
    this.title = title;
    this.author = author;
    this.lang = lang;
    this.pages = pages;
    this.status = Boolean(status);
    this.published = published;
    this.subject = subject;
  }
}

const defaultBook = new Book(
  '48 Laws of Power',
  'Robert Green',
  'English',
  480,
  false
);

defaultBook.published = 1998;
defaultBook.subject = '#self-help';

myLibrary.push(defaultBook);

createBook(defaultBook);

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

function addBook() {
  const title = getById('title').value;
  const author = getById('author').value;
  const lang = getById('lang').value;
  const pages = getById('pages').value;
  const published = getById('published').value;
  const subject = getById('subject').value;
  const status = getById('mark-read-form').checked;

  const book = new Book(title, author, lang, pages, status, published, subject);

  myLibrary.push(book);

  bookForm.reset();

  modal.classList.remove('active');
  addItem.classList.remove('toggle');

  createBook(book);
  updateBookLog();
}

function editBook() {
  const { bookIndex } = bookForm.dataset;
  const book = myLibrary[bookIndex];
  book.title = getById('title').value;
  book.author = getById('author').value;
  book.lang = getById('lang').value;
  book.pages = getById('pages').value;
  book.published = getById('published').value;
  book.subject = getById('subject').value;
  book.status = getById('mark-read-form').checked;

  bookForm.reset();
  modal.classList.remove('active');
  addItem.classList.remove('toggle');

  const bookDiv = document.querySelector(`.book[data-index = '${bookIndex}']`);

  bookDiv.querySelector('.title').textContent = book.title;
  bookDiv.querySelector('.author').textContent = `By ${book.author}`;
  bookDiv.querySelector('.lang').textContent = `Language : ${book.lang} `;
  bookDiv.querySelector('.pages').textContent = `Pages : ${book.pages}`;

  let published = bookDiv.querySelector('.published');

  if (book.published) {
    if (!published) {
      published = document.createElement('p');
      bookDiv.querySelector('.book-info').appendChild(published);
      published.classList.add('published');
    }
    published.textContent = `Published : ${book.published}`;
  } else if (published) {
    published.remove();
  }

  let subject = bookDiv.querySelector('.subject');
  if (book.subject) {
    if (!subject) {
      subject = document.createElement('p');
      bookDiv.querySelector('.book-info').appendChild(subject);
      subject.classList.add('subject');
    }
    subject.textContent = `Subject : ${book.subject}`;
  } else if (subject) {
    subject.remove();
  }

  bookDiv.querySelector('input[type="checkbox"]').checked = book.status;
  updateBookLog();
}

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (bookForm.dataset.action === 'add') {
    addBook();
  } else if (bookForm.dataset.action === 'edit') {
    editBook();
  }
});

bookShelf.addEventListener('click', (e) => {
  if (e.target.matches('.close, .close *')) {
    const book = e.target.closest('.book');
    const { index } = book.dataset;
    myLibrary.splice(index, 1);
    book.remove();
    bookForm.reset();
    updateBookLog();
  }

  if (e.target.matches('.edit, .edit *')) {
    const book = e.target.closest('.book');
    const { index } = book.dataset;
    const bookObj = myLibrary[index];
    getById('title').value = bookObj.title;
    getById('author').value = bookObj.author;
    getById('lang').value = bookObj.lang;
    getById('pages').value = bookObj.pages;
    getById('published').value = bookObj.published;
    getById('subject').value = bookObj.subject;
    getById('mark-read-form').checked = bookObj.status;

    bookForm.dataset.action = 'edit';
    bookForm.dataset.bookIndex = index;

    modal.classList.add('active');
  }
});

const totalBooks = document.querySelector('.log p:nth-child(2)');
const readBooks = document.querySelector('.log p:nth-child(3)');
const notReadBooks = document.querySelector('.log p:nth-child(4)');

bookShelf.addEventListener('change', (e) => {
  if (e.target.matches("input[type='checkbox']")) {
    const bookIndex = e.target.closest('.book').dataset.index;
    myLibrary[bookIndex].status = e.target.checked;
  }
  updateBookLog();
});

function updateBookLog() {
  const total = myLibrary.length;
  const read = myLibrary.filter((book) => book.status).length;
  const notRead = total - read;

  if (total === 0 && read === 0 && notRead === 0) {
    totalBooks.textContent = `Total Books : 0`;
    readBooks.textContent = `Read : 0`;
    notReadBooks.textContent = `Not Read : 0`;
  } else {
    totalBooks.textContent = `Total Books : ${total}`;
    readBooks.textContent = `Read : ${read}`;
    notReadBooks.textContent = `Not Read : ${notRead}`;
  }
}
updateBookLog();

const filterBy = getById('filterBy');

function filterBooks() {
  const { value } = filterBy;

  let filteredBooks = [];

  switch (value) {
    case 'title':
      filteredBooks = myLibrary.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'author':
      filteredBooks = myLibrary.sort((a, b) =>
        a.author.localeCompare(b.author)
      );
      break;
    case 'language':
      filteredBooks = myLibrary.sort((a, b) => a.lang.localeCompare(b.lang));
      break;
    case 'published':
      filteredBooks = myLibrary.sort((a, b) =>
        a.published.localeCompare(b.published)
      );
      break;
    case 'read':
      filteredBooks = myLibrary.filter((book) => book.status);
      break;
    case 'not-read':
      filteredBooks = myLibrary.filter((book) => !book.status);
      break;
    default:
      filteredBooks = myLibrary;
  }
  const unfilteredBooks = myLibrary;
  myLibrary = filteredBooks;
  displayBooks(myLibrary);
  myLibrary = unfilteredBooks;
}

filterBy.addEventListener('change', filterBooks);

function clearBookShelf() {
  const books = bookShelf.querySelectorAll('.book');
  books.forEach((book) => {
    book.remove();
  });
}

function displayBooks(books) {
  clearBookShelf();

  books.forEach((book) => {
    createBook(book);
  });
}
