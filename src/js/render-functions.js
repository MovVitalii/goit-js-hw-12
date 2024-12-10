import iziToast from 'izitoast'; 

export const renderImages = images => {
  const gallery = document.querySelector('.gallery');

  images.forEach(image => {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    galleryItem.appendChild(img);
    galleryItem.appendChild(info);
    gallery.appendChild(galleryItem);
  });
};

export const clearGallery = () => {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
};

export const showLoadingIndicator = () => {
  const loader = document.getElementById('loader');
  loader.style.display = 'block';
};

export const hideLoadingIndicator = () => {
  const loader = document.getElementById('loader');
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
