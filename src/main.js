import { fetchImages, resetPage, incrementPage } from './js/pixabay-api';
import {
  renderImages,
  clearGallery,
  showLoadingIndicator,
  hideLoadingIndicator,
  showNoImagesFoundMessage,
  showEndOfCollectionMessage,
} from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let totalHits = 0;

// Ініціалізація SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

// Обробка пошуку
const handleSearch = async () => {
  clearGallery();
  showLoadingIndicator();
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(currentQuery);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      showNoImagesFoundMessage();
      return;
    }

    renderImages(data.hits);
    lightbox.refresh();

    if (totalHits > 15) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({
      title: 'Error!',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoadingIndicator();
  }
};

// Обробка кнопки Load More
const handleLoadMore = async () => {
  incrementPage();
  showLoadingIndicator();
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(currentQuery);
    renderImages(data.hits);
    lightbox.refresh();

    const loadedImages = document.querySelectorAll('.gallery-item').length;

    // Перевірка: якщо всі зображення завантажені
    if (loadedImages >= totalHits) {
      loadMoreBtn.style.display = 'none';
      showEndOfCollectionMessage();
      return;
    } else {
      loadMoreBtn.style.display = 'block';
    }

    // Логіка для скролу вниз на висоту двох рядків
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      const gallery = document.querySelector('.gallery');
      const firstRowItem = galleryItems[0];
      const { height: cardHeight } = firstRowItem.getBoundingClientRect();

      // Визначаємо відступи між рядками
      const rowGap = parseFloat(getComputedStyle(gallery).gap || 0);

      // Висота двох рядків
      const itemsInRow = 5; // 5 елементів у рядку згідно з вашим стилем
      const scrollHeight = (cardHeight + rowGap) * 2; // Висота двох рядків
      window.scrollBy({
        top: scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error!',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoadingIndicator();
  }
};

// Обробка сабміту форми
form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning!',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  resetPage();
  await handleSearch();
});

// Додавання обробника на кнопку Load More
loadMoreBtn.addEventListener('click', handleLoadMore);
