import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayFetch from './fetchQuery';
import galleryCard from './templates/gallery-card';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

var lightbox = new SimpleLightbox('.gallery .photo-card a', {
  /* options */
});

const pixabayFetch = new PixabayFetch();

refs.form.addEventListener('submit', onSubmitClick);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

refs.loadMoreBtn.classList.add('is-hidden');

function onSubmitClick(e) {
  e.preventDefault();

  refs.loadMoreBtn.classList.add('is-hidden');

  const form = e.currentTarget;
  pixabayFetch.query = form.elements.searchQuery.value;

  refs.gallery.innerHTML = '';
  pixabayFetch.resetPage();
  fetchGallery();
}

function onLoadMore() {
  fetchGallery();
}

function renderGalleryItem(item) {
  item.map(item => {
    return refs.gallery.insertAdjacentHTML('beforeend', galleryCard(item));
  });
}

function fetchGallery() {
  pixabayFetch
    .fetchSearchQuery()
    .then(result => {
      if (result.length === 40) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
      if (result.length < 40) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.warning("We're sorry, but you've reached the end of search results.");
      }
      renderGalleryItem(result);
      lightbox.refresh();
    })
    .catch(error => console.log(error));
}
