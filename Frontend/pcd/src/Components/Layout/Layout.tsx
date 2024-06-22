import "../../style/css/Layout.css";
import IAcoach from "../../assets/IAcoach.png";
import fitnessGirl from "../../assets/fitness-girl.png";
import LayoutLeftContent from "./LayoutLeftContent";
import { useState, useEffect } from "react";

function Layout() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, [isVisible]);

  return (
    <>
      <div className={`Layout-Container ${isVisible ? "visible" : "fade-in"}`}>
        <div className="Layout-Container-left">
          <LayoutLeftContent />
          <ul className="mini-blocks">
            <li className="mini-block">
              <img
                src={IAcoach}
                loading="lazy"
                style={{ width: "50px", objectFit: "contain" }}
                alt=""
              />
              ia coach
            </li>
            <li className="mini-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="52"
                width="60"
                viewBox="0 0 640 512"
              >
                <path
                  fill="#ffffff"
                  d="M96 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V224v64V448c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V384H64c-17.7 0-32-14.3-32-32V288c-17.7 0-32-14.3-32-32s14.3-32 32-32V160c0-17.7 14.3-32 32-32H96V64zm448 0v64h32c17.7 0 32 14.3 32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32v64c0 17.7-14.3 32-32 32H544v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32V288 224 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32zM416 224v64H224V224H416z"
                />
              </svg>
              customized workout programs
            </li>
            <li className="mini-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="52"
                width="44"
                viewBox="0 0 384 512"
              >
                <path
                  fill="#ffffff"
                  d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM305 273L177 401c-9.4 9.4-24.6 9.4-33.9 0L79 337c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L271 239c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                />
              </svg>
              Nutrition advices
            </li>
          </ul>
        </div>

        <div className="Layout-Container-right">
          <img
            src={fitnessGirl}
            loading="lazy"
            className="fitnessGirl"
            alt="fitnessGirl"
          />
        </div>
      </div>
    </>
  );
}

export default Layout;
