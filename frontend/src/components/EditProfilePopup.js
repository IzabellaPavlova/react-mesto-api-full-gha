import { useContext, useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onSubmit({
      name: name,
      about: description
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      name={'profile'}
      title={'Редактировать профиль'}
      buttonText={'Сохранить'}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__input-container">
        <label className="form__field">
          <input className="form__input form__input_text-profile_name"
            type="text" name="name" placeholder="Имя" required
            minLength="2" maxLength="40" id="profile-name" onChange={handleNameChange} value={name || ''} />
          <span className="form__input-error profile-name-error"></span>
        </label>
        <label className="form__field">
          <input className="form__input form__input_text-profile_description"
            type="text" name="description" placeholder="Описание"
            required minLength="2" maxLength="200"
            id="profile-description" onChange={handleDescriptionChange} value={description || ''} />
          <span className="form__input-error profile-description-error">Error
            is here</span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default EditProfilePopup;
