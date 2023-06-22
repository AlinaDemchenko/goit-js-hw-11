import axios from "axios";

export async function getPictures(tag, page){
   const response = await axios.get(`https://pixabay.com/api/`, {
        params: {
            key: "37591930-7d732b17549968c758f6fdf27",
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            q: tag,
            per_page: 40,
            page: page
        }
      });
      return response;
    }

    

















