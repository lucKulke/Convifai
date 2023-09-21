import { navLinks } from "../constans";

function Dropdown() {
  return (
    <div className="w-full bg-slate-100 p-5">
      <ul>
        {navLinks.map((item) => (
          <li className="navbarLink" id={item.label}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;
