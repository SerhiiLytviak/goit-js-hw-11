const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export default class PixabayFetch {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchSearchQuery() {
    const API_KEY = '25011140-7414e41e18c0688e8302f08b5';
    const url = 'https://pixabay.com/api/?';

    try {
      const response = await axios.get(
        `${url}key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`,
      );
      //   console.log(response.data.hits);
      if (response.data.hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }
      if (this.page === 1) {
        Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
      }

      const increasedPage = await (this.page += 1);

      return response.data.hits;
    } catch (error) {
      console.error(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
