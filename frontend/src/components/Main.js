import { useContext } from 'react';
import Card from './Card.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main(props) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <main className="content">
      <section className="profile">
        <div className="profile__user-card">
          <button className="profile__edit-avatar-button" type="button"
            title="Обновить аватар" onClick={props.onEditAvatar}>
            <img className="profile__avatar" src={currentUser.avatar} alt="Аватар
              пользователя Место"/></button>
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button className="profile__edit-button" type="button"
              title="Редактировать профиль" onClick={props.onEditProfile}></button>
            <p className="profile__description">{currentUser.about}</p>
          </div>
        </div>
        <button className="profile__add-button" type="button" title="Добавить
          новое место" onClick={props.onAddCard}></button>
      </section>
      <section className="galery">
        <ul className="galery__cards">
          {
            props.cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                onCardClick={props.onCardClick}
                onCardLike={props.onCardLike}
                onCardDelete={props.onCardDelete}
              />
            ))
          }
        </ul>
      </section>
    </main>
  )
}

export default Main;
