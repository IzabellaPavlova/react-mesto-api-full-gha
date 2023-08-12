import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from './Header.js';
import Footer from './Footer.js';
import Main from './Main.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import success from "../images/success.svg";
import reject from "../images/reject.svg";
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import api from '../utils/api.js';
import * as auth from "../utils/auth";

function App() {
  const navigate = useNavigate();
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false)
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false)
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false)
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null)
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailName, setEmailName] = useState(null);
  const [popupImage, setPopupImage] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  // auth

  function handleisInfoTooltipOpen() {
    setIsInfoTooltipOpen(true);
  }

  function onRegister(email, password) {
    auth.registerUser(email, password).then(() => {
      setPopupImage(success);
      setPopupTitle("Вы успешно зарегистрировались!");
      navigate("/sign-in");
    }).catch(() => {
      setPopupImage(reject);
      setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
    }).finally(handleisInfoTooltipOpen);
  }

  function onLogin(email, password) {
    auth.loginUser(email, password).then((res) => {
      localStorage.setItem("jwt", res.token);
      setIsLoggedIn(true);
      setEmailName(email);
      navigate("/");
    }).catch(() => {
      setPopupImage(reject);
      setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
      handleisInfoTooltipOpen();
    });
  }

  function onSignOut() {
    setIsLoggedIn(false);
    setEmailName(null);
    navigate("/sign-in");
    localStorage.removeItem("jwt");
  }

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.getToken(jwt).then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setEmailName(res.data.email);
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn === true) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Cards, userInfo

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()]).then(([userData, cards]) => {
      setCurrentUser(userData);
      setCards(cards);
    }).catch((error) => {
      console.error(error);
    });
  }, [])

  // Profile

  function handleEditProfileClick() {
    setIsProfilePopupOpen(true);
  }

  function handleUpdateUser(data) {
    api.updateUserInfo(data).then((newUserInfo) => {
      setCurrentUser(newUserInfo);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    });
  }

  function handleEditAvatarClick() {
    setIsAvatarPopupOpen(true);
  }

  function handleUpdateAvatar(data) {
    api.updateProfileAvatar(data).then((newUserInfo) => {
      setCurrentUser(newUserInfo);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    });
  }

  // Cards

  function handleAddPlaceClick() {
    setIsAddCardPopupOpen(true);
  }

  function handleCreateCard(data) {
    api.addNewCard(data).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    if (!isLiked) {
      api.addCardLike(card._id).then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      }).catch((error) => {
        console.error(error);
      });
    }
    else {
      api.removeCardLike(card._id).then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  function handleCardDelete(card) {
    api.removeCard(card._id).then(() => {
      setCards((items) => items.filter((c) => c._id !== card._id && c));
    }).catch((err) => {
      console.error(err);
    });
  }

  function closeAllPopups() {
    setIsProfilePopupOpen(false);
    setIsAddCardPopupOpen(false);
    setIsAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Routes>
            <Route path="/sign-in" element={
              <>
                <Header title="Регистрация" route="/sign-up"/>
                <Login onLogin={onLogin} />
              </>
            }/>

            <Route path="/sign-up" element={
              <>
                <Header title="Войти" route="/sign-in"/>
                <Register onRegister={onRegister} />
              </>
            }/>

            <Route exact path="/" element={
              <>
                <Header
                  title="Выйти"
                  email={emailName}
                  onClick={onSignOut}
                  route=""
                />
                <ProtectedRoute
                  component={Main}
                  isLogged={isLoggedIn}
                  onEditProfile={handleEditProfileClick}
                  onAddCard={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                />
                <Footer />
              </>
            }/>

            <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/sign-in"}/>} />
          </Routes>

          <EditProfilePopup
            isOpen={isProfilePopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleUpdateUser}
          />

          <AddPlacePopup
            isOpen={isAddCardPopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleCreateCard}
          />

          <EditAvatarPopup
            isOpen={isAvatarPopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleUpdateAvatar}
          />

          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
          />

          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            image={popupImage}
            title={popupTitle}
            onClose={closeAllPopups}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
