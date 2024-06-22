import { AuthContext } from "../Contexts/AuthContext";
import "../style/css/Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);
  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowNav(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNav(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    setShowNav(false);
  }, []);

  const handleClick = (className: string) => {
    if (window.location.hash !== "#") {
      navigate("/");
    }
    setTimeout(() => {
      const element = document.querySelector("." + className);
      if (element instanceof HTMLElement) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const { user, handleLogout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="navbar-container" ref={navRef}>
        <span className="mini-logo">
          <Link className="Links" to={"/"}>
            <span className="sub-mini-logo">In</span>Shape
          </Link>
        </span>
        <div className="burger-menu" onClick={toggleNav}>
          &#9776;
        </div>
        <ul className={`navbar-listItems ${showNav ? "show" : ""}`}>
          <div className="burger-menu second-burger-menu" onClick={toggleNav}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="18"
              viewBox="0 0 384 512"
            >
              <path
                fill="#ffffff"
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
              />
            </svg>
          </div>
          <li
            className="navbarItems firstChild"
            onClick={() => {
              handleClick("aboutUS-container");
            }}
          >
            About Us
          </li>
          <li
            className="navbarItems"
            onClick={() => {
              handleClick("title-services");
            }}
          >
            Our Services
          </li>
          {user ? (
            <li className="navbarItems">
              <Link className="Links" to={"/Profile/"}>
                Profile
              </Link>
            </li>
          ) : null}

          {user ? (
            <li
              className="navbarItems Join"
              onClick={() => {
                handleLogout();
              }}
            >
              Log out
            </li>
          ) : (
            <li className="navbarItems Join">
              <Link className="Links" to={"/Accounts/"}>
                Join{" "}
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="lineDivider">
        <div className="subLine"></div>
      </div>
    </div>
  );
}

export default Navbar;
