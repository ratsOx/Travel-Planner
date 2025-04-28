
const items = document.querySelectorAll('.carousel .item');
let current = 0;

function showSlide(index, direction) {
  items.forEach(item => {
    item.classList.remove('active', 'slide-left', 'slide-right');
  });

  const currentItem = items[current];
  const nextItem = items[index];

  if (direction === 'next') {
    currentItem.classList.add('slide-left');
  } else {
    currentItem.classList.add('slide-right');
  }

  nextItem.classList.add('active');

  current = index;
}

function nextSlide() {
  const nextIndex = (current + 1) % items.length;
  showSlide(nextIndex, 'next');
}

function prevSlide() {
  const prevIndex = (current - 1 + items.length) % items.length;
  showSlide(prevIndex, 'prev');
}

document.querySelector('.next').addEventListener('click', nextSlide);
document.querySelector('.prev').addEventListener('click', prevSlide);

// Init
items[0].classList.add('active');