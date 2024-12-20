import axios from 'axios';

const API_KEY = '47399675-043703f8487c7f7d0445216cc';
const BASE_URL = 'https://pixabay.com/api/';

let currentPage = 1;
const PER_PAGE = 15;

export const fetchImages = async query => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: PER_PAGE,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch images. Status: ${response.status}`);
    }

    if (response.data.totalHits === 0) {
      throw new Error('No images found for your search query.');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error.message);
    throw new Error('Failed to fetch images');
  }
};

export const resetPage = () => {
  currentPage = 1;
};

export const incrementPage = () => {
  currentPage += 1;
};
