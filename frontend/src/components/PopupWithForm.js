function PopupWithForm(props) {
  return (
    <section className={`popup popup-${props.name} ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <form className={`form form-${props.name}`} name={props.name} onSubmit={props.onSubmit}>
          <p className="form__title">{props.title}</p>
          {props.children}
          <button className="form__submit-button" type="submit" title={props.buttonText}>{props.buttonText}</button>
        </form>
        <button className="popup__close-button popup__close-button_profile"
          type="button" title="Закрыть" onClick={props.onClose}></button>
      </div>
    </section>
  )
}

export default PopupWithForm;
