function InfoTooltip(props) {
  return (
    <section className={`popup ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <img className="popup__status" src={props.image} alt={props.title}/>
        <h2 className="popup__message">{props.title}</h2>
        <button className="popup__close-button"
          type="button" title="Закрыть" onClick={props.onClose}></button>
      </div>
    </section>
  );
}

export default InfoTooltip;
