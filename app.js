const getById = (selector) => document.getElementById(selector);
const select = (selector) => document.querySelector(selector);
const newElm = (selector) => document.createElement(selector);
const modal = select('.modal');
const addBtn = select('.add-btn');
const closeModalBtn = select('.close-modal-btn');
const addItem = select('.add-item');
const bookForm = select('.book-form');

const bookShelf = select('.bookshelf');
let myLibrary = [];

addBtn.addEventListener('click', () => {
  modal.classList.add('active');
  addItem.classList.add('toggle');
  resetErrors();
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  addItem.classList.remove('toggle');
  bookForm.dataset.action = 'add';
  delete bookForm.dataset.bookIndex;
  resetErrors();
  bookForm.reset();
});

class Book {
  constructor(title, author, language, pages, status, published, subject) {
    this.title = title;
    this.author = author;
    this.language = language;
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
  const newBook = newElm('div');
  newBook.dataset.index = myLibrary.indexOf(book);
  bookShelf.appendChild(newBook);
  newBook.classList.add('book');

  // control buttons

  const controlDiv = newElm('div');
  newBook.appendChild(controlDiv);
  controlDiv.classList.add('control');

  const editBtn = newElm('button');
  controlDiv.appendChild(editBtn);
  editBtn.classList.add('edit');

  const editBtnImg = newElm('img');
  editBtn.appendChild(editBtnImg);
  editBtnImg.src = 'icon/edit_FILL0_wght400_GRAD0_opsz48.svg';
  editBtnImg.alt = 'edit button';

  const closeBtn = newElm('button');
  controlDiv.appendChild(closeBtn);
  closeBtn.classList.add('close');

  const closeBtnImg = newElm('img');
  closeBtn.appendChild(closeBtnImg);
  closeBtnImg.src = 'icon/close.svg';
  closeBtn.alt = 'close button';

  // book info

  const bookInfo = newElm('div');
  newBook.appendChild(bookInfo);
  bookInfo.classList.add('book-info');

  const title = newElm('p');
  bookInfo.appendChild(title);
  title.classList.add('title');
  title.textContent = `${book.title}`;

  const author = newElm('p');
  bookInfo.appendChild(author);
  author.classList.add('author');
  author.textContent = `By ${book.author}`;

  const language = newElm('p');
  bookInfo.appendChild(language);
  language.classList.add('language');
  language.textContent = `Language : ${book.language}`;

  const pages = newElm('p');
  bookInfo.appendChild(pages);
  pages.classList.add('pages');
  pages.textContent = `Page : ${book.pages}`;

  if (book.published) {
    const published = newElm('p');
    bookInfo.appendChild(published);
    published.classList.add('published');
    published.textContent = `Published : ${book.published}`;
  }

  if (book.subject) {
    const subject = newElm('p');
    bookInfo.appendChild(subject);
    subject.classList.add('subject');
    subject.textContent = `Subject : ${book.subject}`;
  }

  // toggle button

  const read = newElm('div');
  newBook.appendChild(read);
  read.classList.add('read');

  const input = newElm('input');
  read.appendChild(input);
  input.type = 'checkbox';
  input.name = 'mark-read';
  input.id = `mark-read-${myLibrary.indexOf(book)}`;
  input.checked = book.status;

  const label = newElm('label');
  read.appendChild(label);
  label.htmlFor = `mark-read-${myLibrary.indexOf(book)}`;

  const span1 = newElm('span');
  label.appendChild(span1);
  span1.textContent = `Mark as Read`;

  const span2 = newElm('span');
  label.appendChild(span2);
}

function addBook() {
  const title = getById('title').value;
  const author = getById('author').value;
  const language = getById('language').value;
  const pages = getById('pages').value;
  const published = getById('published').value;
  const subject = getById('subject').value;
  const status = getById('mark-read-form').checked;

  const book = new Book(
    title,
    author,
    language,
    pages,
    status,
    published,
    subject
  );
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
  book.language = getById('language').value;
  book.pages = getById('pages').value;
  book.published = getById('published').value;
  book.subject = getById('subject').value;
  book.status = getById('mark-read-form').checked;

  bookForm.reset();
  modal.classList.remove('active');
  addItem.classList.remove('toggle');

  const bookDiv = select(`.book[data-index = '${bookIndex}']`);

  bookDiv.querySelector('.title').textContent = book.title;
  bookDiv.querySelector('.author').textContent = `By ${book.author}`;
  bookDiv.querySelector(
    '.language'
  ).textContent = `Language : ${book.language} `;
  bookDiv.querySelector('.pages').textContent = `Pages : ${book.pages}`;

  let published = bookDiv.querySelector('.published');

  if (book.published) {
    if (!published) {
      published = newElm('p');
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
      subject = newElm('p');
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
    getById('language').value = bookObj.language;
    getById('pages').value = bookObj.pages;
    getById('published').value = bookObj.published;
    getById('subject').value = bookObj.subject;
    getById('mark-read-form').checked = bookObj.status;

    bookForm.dataset.action = 'edit';
    bookForm.dataset.bookIndex = index;

    modal.classList.add('active');
  }
});

const totalBooks = select('.log p:nth-child(2)');
const readBooks = select('.log p:nth-child(3)');
const notReadBooks = select('.log p:nth-child(4)');

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
      filteredBooks = myLibrary.sort((a, b) =>
        a.language.localeCompare(b.language)
      );
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

function getErrorMsg(field, element) {
  if (element.validity.tooShort) {
    return `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } must be at least ${element.minLength} character`;
  }

  if (element.validity.rangeOverflow) {
    if (field === 'published') {
      return `Year ${
        field.charAt(0).toUpperCase() + field.slice(1)
      } can't be more than ${element.max}; you provided ${element.value}.`;
    }
    if (field === 'pages') {
      return `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } can't be more than ${element.max}; you provided ${element.value}.`;
    }
    return `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } can't be more than ${element.max}; you provided ${element.value.length}.`;
  }

  if (element.validity.rangeUnderflow) {
    if (field === 'published') {
      return `Year ${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must be at least ${element.min}`;
    }
    return `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } must be at least ${element.min}`;
  }

  if (field === 'language' && element.validity.patternMismatch) {
    return `Language can't start/end with spaces or include special characters other than hyphen.`;
  }

  if (field === 'author' && element.validity.patternMismatch) {
    return 'Author name must be in english and a valid name without leading/trailing spaces';
  }

  return '';
}

function showError() {
  const fields = [
    'title',
    'author',
    'language',
    'pages',
    'published',
    'subject',
  ];
  const requiredFields = ['title', 'author', 'language', 'pages', 'published'];
  const maxLength = { title: 100, author: 50, language: 20, subject: 200 };
  fields.forEach((field) => {
    const element = getById(field);
    const errorElement = select(`#${field} + span.error`);

    element.addEventListener('input', (e) => {
      if (requiredFields.includes(field) && element.value.length === 0) {
        errorElement.className = 'error active';
        errorElement.textContent = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } must not be empty.`;
        return;
      }

      if (maxLength[field] && element.value.length > maxLength[field]) {
        errorElement.className = 'error active';
        errorElement.textContent = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } can't be more than ${maxLength[field]} characters; you provided ${
          element.value.length
        }.`;
        return;
      }

      if (element.validity.valid) {
        errorElement.textContent = '';
        errorElement.className = 'error';
      } else {
        const errorMsg = getErrorMsg(field, element);
        errorElement.className = 'error active';
        errorElement.textContent = errorMsg;
      }
    });

    if (field === 'published') {
      element.max = new Date().getFullYear().toString();
    }
  });
}

showError();

function resetErrors() {
  const errors = [
    select('#title + span.error'),
    select('#author + span.error'),
    select('#language + span.error'),
    select('#pages + span.error'),
    select('#published + span.error'),
    select('#subject + span.error'),
  ];

  errors.forEach((error) => {
    error.textContent = '';
    error.className = 'error';
  });
}

function validateForm(e) {
  const requiredFields = ['title', 'author', 'language', 'pages', 'published'];
  let allFieldsValid = true;

  requiredFields.forEach((field) => {
    const element = getById(field);
    const errorElement = select(`#${field} + span.error`);

    if (element.value.length === 0) {
      errorElement.className = 'error active';
      errorElement.textContent = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must not be empty.`;
      allFieldsValid = false;
      return;
    }

    const errorMsg = getErrorMsg(field, element);
    if (errorMsg) {
      errorElement.className = 'error active';
      allFieldsValid = false;
      return;
    }

    errorElement.textContent = '';
    errorElement.className = 'error';
  });

  if (!allFieldsValid) {
    e.preventDefault();
  }
}

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  validateForm();
  if (bookForm.dataset.action === 'add') {
    addBook();
  } else if (bookForm.dataset.action === 'edit') {
    editBook();
  }
});
