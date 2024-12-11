import iziToast from 'izitoast';

export const renderImages = images => {
  const gallery = document.querySelector('.gallery');

  const markup = images
    .map(image => {
      return `
        <div class="gallery-item">
          <a href="${image.largeImageURL}">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
        </div>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
};

export const clearGallery = () => {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
};

export const showLoadingIndicator = () => {
  const loader = document.querySelector('.loader');
  loader.style.display = 'block';
};

export const hideLoadingIndicator = () => {
  const loader = document.querySelector('.loader');
  loader.style.display = 'none';
};

export const showNoImagesFoundMessage = () => {
  iziToast.info({
    title: 'No Results',
    message: 'No images found for your search query.',
    position: 'topRight',
  });
};

export const showEndOfCollectionMessage = () => {
  iziToast.success({
    title: 'End of Collection',
    message: 'You have reached the end of the collection.',
    position: 'topRight',
  });
};
