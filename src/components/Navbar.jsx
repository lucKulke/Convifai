import { useState, useRef, useEffect } from "react";
import { PiRobot } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import Dropdown from "./Dropdown";
import { navLinks } from "../constans";

function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [close, setClose] = useState(false);

  useEffect(() => {
    // Function to close the dropdown when a click occurs outside of it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
        setClose(true);
      }
    };

    // Add event listener to the document body
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    close ? setClose(false) : setDropdown(true);
  };

  return (
    <nav className="max-container">
      <div className="mainNavBar">
        <div className="flex w-[60px]">
          <PiRobot className="h-12 w-12" />
        </div>
        <ul className="flex justify-around w-full max-md:hidden">
          {navLinks.map((item) => (
            <li className="navbarLink" id={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="md:hidden">
          <button onClick={toggleDropdown}>
            <RxHamburgerMenu className="h-10 w-10" />
          </button>
        </div>
      </div>
      {dropdown && (
        <div ref={dropdownRef}>
          <Dropdown />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
