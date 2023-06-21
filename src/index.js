import Notiflix from 'notiflix';
 //   Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { getPictures } from './fetch';


Notiflix.Notify.init({
    width: '700px',
    position: 'left-top',
    backOverlay: true,
    backOverlayColor: 'rgba(20, 20, 20, 0.17)',
    fontSize: '26px',
    failure: {
      background: 'rgb(47, 37, 85)',
      notiflixIconColor: 'rgb(255, 255, 255)',
    },
  });

const refs = {
form: document.querySelector("#search-form"),
gallery: document.querySelector(".gallery"),
button: document.querySelector(".button")
}

refs.button.setAttribute("disabled", true)

refs.form.addEventListener("input", (evt)=>{
  if (evt.currentTarget.searchQuery.value.length > 0){
    refs.button.removeAttribute("disabled")
  } else{
    refs.button.setAttribute("disabled", true)  
  }
})
refs.form.addEventListener("submit", handlerSubmit)

async function handlerSubmit(evt){
  evt.preventDefault();
  const q = evt.currentTarget.elements.searchQuery.value;
  try {const data = await getPictures(q)
  refs.gallery.insertAdjacentHTML('beforeend', renderPics(data));
  new SimpleLightbox('.gallery a', {captionsData: 'data-info',
  captionDelay: 250,});}
  catch {error => console.log("Sorry, there are no images matching your search query. Please try again.")}
}

function renderPics(picsData) {
  return picsData.data.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
   return `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" data-info="🩵 ${likes} 👀 ${views} 💬 ${comments} ⏬️ ${downloads}"/>
    </a>
  </div>`
  }).join("");
}




{/* <div class="info">
<p class="info-item">
  <b>🩵 ${likes}</b>
</p>
<p class="info-item">
  <b>👀 ${views}</b>
</p>
<p class="info-item">
  <b>💬 ${comments}</b>
</p>
<p class="info-item">
  <b>⏬️ ${downloads}</b>
</p>
</div> */}
















 