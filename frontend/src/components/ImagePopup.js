function ImagePopup(props) {
  return (
    <section className={`popup popup-image popup_theme_black ${props.card ? 'popup_opened' : ''}`}>
      {/* <div className="popup__container"> */}
      <div className="popup__card-container">
        <figure className="popup__image-container">
          <img className="popup__image" src={props.card?.link} alt={props.card?.name} />
          <figcaption className="popup__image-caption">{props.card ? props.card.name : ''}</figcaption>
        </figure>
        <button className="popup__close-button popup__close-button_image"
          type="button" title="Закрыть" onClick={props.onClose}></button>
      </div>
    </section>
  )
}

export default ImagePopup;
