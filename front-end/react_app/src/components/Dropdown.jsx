import { navLinks } from "../constans";
import { Link } from "react-router-dom";

function Dropdown(props) {
  return (
    <div className="w-full bg-slate-100 p-5">
      <ul>
        {navLinks.map((item) => (
          <li className="navbarLink" id={item.label}>
            <Link to={item.href}>{item.label}</Link>
          </li>
        ))}
        {props.loggedIn && (
          <li className="navbarLink">
            <Link to="/" onClick={() => props.handleLogout()}>
              Logout
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Dropdown;
