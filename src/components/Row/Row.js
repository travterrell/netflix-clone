import React, { useState, useEffect } from 'react';
import axios from '../../assets/js/axios';
import '../Row/Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url='https://image.tmdb.org/t/p/original/';

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie, event) => {
    let closePreviewDiv = event.target.parentElement.children[0];
    if (trailerUrl) {
      setTrailerUrl('');
      closePreviewDiv.style.opacity = 0;
    } else {
      let name = movie.name || movie.title;
      movieTrailer(name)
      .then((url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get('v'));
        closePreviewDiv.style.opacity = 1;
        if (event.clientY > 350) window.scrollBy(0, 450);
      }).catch((error) => {
        let previewNotAvailableDiv = event.target.parentElement.children[1];
        previewNotAvailableDiv.style.opacity = 1;
        setTimeout(() => {
          previewNotAvailableDiv.style.opacity = 0;
        }, 2000);
      });
    }
  }

  return (
    <div className='row'>
      <h2>{title}</h2>
      <div className='row__posters'>
        {movies.map(movie => (
          <div key={movie?.title || movie?.name || movie?.original_name} className='row__posterContainer'>
            <div
            className={`row__closePreview ${isLargeRow && "row__posterLarge"}`}>
              <p>Close Trailer</p>
            </div>
            <div id={movie?.title || movie?.name || movie?.original_name}
            className={`row__previewNotAvailable ${isLargeRow && "row__posterLarge"}`}>
              <p>Preview Not Available</p>
            </div>
            <img 
            key={movie.id}
            onClick={(event) => handleClick(movie, event)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name} />
          </div>
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
