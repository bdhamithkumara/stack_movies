import React, { useState } from 'react';
import { Link } from "react-router-dom";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

const HomeCard = ({
  item: {
    _id: movieId,
    image,
    title,
    description,
    duration,
    language,
    genre,
    director,
    rating,
    starring,
    trailer,
  },
  showAdditionalButtons = true, // New prop to determine if additional buttons should be shown
}) => {
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  const handlePlayTrailer = () => {
    setIsTrailerPlaying(true);
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}hr : ${minutes}mins`;
  };

  return (
    <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
      <div className='coverImage'>
        <img src={image} alt={title} className='rounded-lg w-full h-64 object-cover' />
      </div>
      <div className='content flex flex-col mt-4'>
        <div className='details'>
          <h1 className='text-white text-2xl font-bold'>{title}</h1>
          <div className='rating flex items-center space-x-2 mt-2'>
            <label className='label'>{language}</label>
            <span className='label label-yellow'>{genre}</span>
            <label className='label'>{formatDuration(duration)}</label>
          </div>
          <p className='text-gray-300 mt-4'>{description}</p>

          <Link to={`/movie/${movieId}`} className='mt-6'>
            <button className='primary-btn bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg transform hover:scale-105 transition-transform'>
              <PlayCircleFilledIcon className="play-icon" />
              <span>PLAY NOW</span>
            </button>
          </Link>

          {showAdditionalButtons && (
            <div className="additional-buttons flex flex-wrap gap-4 mt-4">
              <button className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center shadow-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105">
                <i className="fas fa-play mr-2"></i> Watch trailer
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center shadow-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105">
                <i className="fas fa-play mr-2"></i> Watch with Prime
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105">
                <i className="fas fa-plus"></i>
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105">
                <i className="fas fa-thumbs-up"></i>
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105">
                <i className="fas fa-thumbs-down"></i>
              </button>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105">
                <i className="fas fa-share-alt"></i>
              </button>
            </div>
          )}

          {isTrailerPlaying && (
            <video width="400" controls autoPlay className='mt-4'>
              <source src={trailer} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeCard;