import { fetchImages, resetPage, incrementPage } from './js/pixabay-api';
import {
  renderImages,
  clearGallery,
  showLoadingIndicator,
  hideLoadingIndicator,
  showNoImagesFoundMessage,
  showEndOfCollectionMessage,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/izitoast.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let totalHits = 0;

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
    if (totalHits > 15) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({
      title: 'Error!',
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoadingIndicator();
  }
};

const handleLoadMore = async () => {
  incrementPage();
  showLoadingIndicator();
  loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(currentQuery);
    renderImages(data.hits);

    const loadedImages = document.querySelectorAll('.gallery-item').length;

    if (loadedImages >= totalHits) {
      loadMoreBtn.style.display = 'none';
      showEndOfCollectionMessage();
      return;
    } else {
      loadMoreBtn.style.display = 'block';
    }

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    iziToast.error({
      title: 'Error!',
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoadingIndicator();
  }
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning!',
      message: 'Please enter a search query.',
    });
    return;
  }

  currentQuery = query;
  resetPage();
  await handleSearch();
});

loadMoreBtn.addEventListener('click', handleLoadMore);
