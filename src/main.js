// src/main.js

import { fetchImages, resetPage, incrementPage } from './js/pixabay-api';
import {
  renderImages,
  clearGallery,
  showLoadingIndicator,
  hideLoadingIndicator,
  showNoImagesFoundMessage,
  showEndOfCollectionMessage,
} from './js/render-functions.js';
import 'izitoast/dist/css/iziToast.min.css'; 
import iziToast from 'izitoast'; 

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
      position: 'topRight',
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

    const galleryItem = document.querySelector('.gallery-item');
    if (!galleryItem) return; 

    const { height: cardHeight } = galleryItem.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      left: 0,
      behavior: 'smooth',
    });
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

loadMoreBtn.addEventListener('click', handleLoadMore);

