import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { getPictures } from './fetch';

Notiflix.Notify.init({
  width: '500px',
  position: 'center-center',
  backOverlay: true,
  backOverlayColor: 'rgba(0,0,0,0.5)',
  fontSize: '15px',
  timeout: 1000,
  failure: {
    textColor: 'rgb(33, 33, 33)',
    background: '#fff',
    notiflixIconColor: 'rgb(33, 33, 33)',
  },
});

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.button'),
  guard: document.querySelector('.guard'),
};
let page;
let lightbox;
let totalHits;

refs.button.setAttribute('disabled', true);
refs.form.addEventListener('input', evt => {
  if (evt.currentTarget.searchQuery.value.length) {
    refs.button.removeAttribute('disabled');
  } else {
    refs.button.setAttribute('disabled', true);
  }
});
refs.form.addEventListener('submit', handlerSubmit);

async function handlerSubmit(evt) {
  evt.preventDefault();
  const q = evt.currentTarget.elements.searchQuery.value.replace(" ","+");
page = 1;
  try {
    const picsData = await getPictures(q, page);
    if (!picsData.data.hits.length) {
      throw new Error();
    }
    refs.gallery.innerHTML = renderPics(picsData);
    observer.observe(refs.guard)
    totalHits = picsData.data.totalHits;
 lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'data-info',
      captionDelay: 250,
    });
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function renderPics(picsData) {
  return picsData.data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" data-info="🩵 ${likes}  💬 ${comments} ⏬️ ${downloads} 👀 ${views}"/>
    </a>
  </div>`;
      }
    )
    .join('');
}

const options = {
  root: null,
  rootMargin: '500px',
  threshold: 0,
}
 function loadMore(entries, observer) {
  const q = refs.form.elements.searchQuery.value;
  entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        page += 1;
          if (page >= Math.ceil(totalHits / 40)) {
            observer.unobserve(refs.guard);
          }
          const picsData = await getPictures(q, page);
          refs.gallery.insertAdjacentHTML("beforeend", renderPics(picsData))
          lightbox.refresh()
        } 
      })}

const observer = new IntersectionObserver(loadMore, options);

