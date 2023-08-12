import { useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
  const ref = useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onSubmit({
      avatar: ref.current.value
    });
  }

  useEffect(() => {
    ref.current.value = '';
  }, [props.isOpen]);

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      name={'avatar'}
      title={'Обновить аватар'}
      buttonText={'Сохранить'}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__input-container">
        <label className="form__field">
          <input ref={ref} className="form__input form__input_text-avatar_link"
            type="url" name="link"
            placeholder="Ссылка&nbsp;на&nbsp;аватар" required
            id="avatar" />
          <span className="form__input-error avatar-error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
