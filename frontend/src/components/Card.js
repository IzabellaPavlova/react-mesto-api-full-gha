import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = (
    `card__like-button ${isLiked && 'card__like-button_active'}`
  );

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  return (
    <li>
      <article className="card">
        <img className="card__image" alt={props.card.name} src={props.card.link} title="Просмотреть фото" onClick={handleClick} />
        <div className="card__description">
          <h2 className="card__title">{props.card.name}</h2>
          <div className="card__like-container">
            <button className={cardLikeButtonClassName} type="button"
              title="Понравилось" onClick={handleLikeClick}></button>
            <p className="card__like-count">{props.card.likes.length}</p>
          </div>
        </div>
        {isOwn && <button className='card__delete-button' type="button" title="Удалить" onClick={handleDeleteClick}></button>}
      </article>
    </li>
  )
}

export default Card;
