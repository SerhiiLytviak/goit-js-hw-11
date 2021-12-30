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
  pixabayFetch
    .fetchSearchQuery()
    .then(result => {
      console.log(result);
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
    // .then(() => )
    .catch(error => console.log(error));
}

function onLoadMore() {
  pixabayFetch
    .fetchSearchQuery()
    .then(result => {
      console.log(result);
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
    // .then(() => lightbox.refresh())
    .catch(error => console.log(error));
}

function renderGalleryItem(item) {
  item.map(item => {
    return refs.gallery.insertAdjacentHTML('beforeend', galleryCard(item));
  });
}

// function renderGalleryItem(item) {
//   item.map(item => {
//     return refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(item));
//   });
// }

// function createGalleryMarkup(item) {
//   return item
//     .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
//       return `
//         <a href="${largeImageURL}"><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width="325" height="220" /></a>
//       <div class="info">
//           <p class="info-item">
//               <b>Likes</b>
//               ${likes}
//           </p>
//           <p class="info-item">
//               <b>Views</b>
//               ${views}
//           </p>
//           <p class="info-item">
//               <b>Comments</b>
//               ${comments}
//           </p>
//           <p class="info-item">
//               <b>Downloads</b>
//               ${downloads}
//           </p>
//       </div>
//     `;
//     })
//     .join('');
// }
