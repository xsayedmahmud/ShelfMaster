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
