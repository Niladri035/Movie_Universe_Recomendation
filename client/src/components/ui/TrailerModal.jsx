import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeTrailerModal } from '../../store/slices/uiSlice';

const TrailerModal = () => {
  const { isTrailerModalOpen, trailerVideoId } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  if (!isTrailerModalOpen) return null;

  return (
    <div className="trailer-modal-overlay" onClick={() => dispatch(closeTrailerModal())}>
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => dispatch(closeTrailerModal())}>X</button>
        {trailerVideoId ? (
          <div className="video-wrapper">
             <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="no-trailer">
            <h2>Trailer for this movie is currently unavailable.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrailerModal;
