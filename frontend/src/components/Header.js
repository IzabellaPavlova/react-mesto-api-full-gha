import { Link } from "react-router-dom";
import logo from '../images/header-logo.svg';

function Header(props) {
  return (
    <header className="header">
      <a href="#"><img className="header__logo" alt="Логотип Место"
        src={logo} /></a>
      <nav className="header__auth">
        <p className="header__text">{props.email}</p>
        <Link to={props.route} className={`${props.email ? 'header__exit' : 'header__link'}`}
        type="button" onClick={props.onClick}>{props.title}</Link>
      </nav>
    </header>
  )
}

export default Header;
