import "../style/css/AboutUs.css";
import Staali from "../assets/Staali.png";
import Wiem from "../assets/Wiem.png";
import Rami from "../assets/Rami.png";
import Goal from "../assets/achieveGoal.png";
import commercial from "../assets/commercial.png";
import { useEffect, useRef, useState } from "react";

function AboutUS() {
  const [sectionOneVisible, setSectionOneVisible] = useState(false);
  const [sectionTwoVisible, setSectionTwoVisible] = useState(false);
  const [sectionThreeVisible, setSectionThreeVisible] = useState(false);

  const sectionOneRef = useRef(null);
  const sectionTwoRef = useRef(null);
  const sectionThreeRef = useRef(null);

  useEffect(() => {
    const sectionRefs = [sectionOneRef, sectionTwoRef, sectionThreeRef];
    const setSectionVisibilities = [
      setSectionOneVisible,
      setSectionTwoVisible,
      setSectionThreeVisible,
    ];
    const handleScroll = () => {
      sectionRefs.forEach((sectionRef, index) => {
        if (sectionRef.current) {
          const sectionPosition =
            sectionRef.current.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          const scrollThreshold = windowHeight * 0.8;
          if (sectionPosition < scrollThreshold) {
            setSectionVisibilities[index](true);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="aboutUS-container">
        <div className="sectionOne">
          <div
            className={`sectionOne-left-container ${
              sectionOneVisible ? "sectionOneVisible" : "sectionOneNotVisible"
            }`}
            ref={sectionOneRef}
          >
            <div className="aboutUs-title">
              <span className="aboutUs-title-deco">Who</span> are we ?
            </div>
            <span className="Introduction">
              Welcome to <span className="special-deco">In</span>Shape , where
              passion for fitness meets cutting-edge technology. We are a team
              of health enthusiasts, fitness experts, and tech innovators
              dedicated to revolutionizing the way you approach wellness.
            </span>
          </div>
          <div className="sectionOne-right-container">
            <img
              src={commercial}
              className="commercial"
              loading="lazy"
              alt="commercial"
            />
          </div>
        </div>

        <div className="sectionTwo">
          <div className="sectionTwo-left-container">
            <img
              src={Goal}
              className="achieve-goal"
              loading="lazy"
              alt="achieve-goal"
            />
          </div>
          <div
            className={`sectionTwo-right-container ${
              sectionTwoVisible ? "sectionTwoVisible" : "sectionTwoNotVisible"
            }`}
            ref={sectionTwoRef}
          >
            <span className="Introduction">
              At <span className="special-deco">In</span>Shape, we believe that
              achieving your fitness goals should be empowering, enjoyable, and
              above all, personalized. With our platform, you're not just
              another user; you're part of a vibrant community driven by a
              shared commitment to health and well-being.
            </span>
          </div>
        </div>

        <div className="sectionThree">
          <div className="aboutUs-title">
            <span className="aboutUs-title-deco">Meet</span> our team
          </div>
          <div
            className={`Team ${
              sectionThreeVisible
                ? "sectionThreeVisible"
                : "sectionThreeNotVisible"
            }`}
            ref={sectionThreeRef}
          >
            <div className="team-member">
              <img className="photo" src={Rami} loading="lazy" alt="rami" />
              <div className="some-infos">
                <span className="name">Mohamed Rami Rahmeni</span>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={20}
                    width={20}
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z"
                    />
                  </svg>
                  <span className="profession">Engineering student</span>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={20}
                    width={20}
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                    />
                  </svg>
                  <span className="email">mohamedamine.staali@ensi-uma.tn</span>
                </div>
              </div>
            </div>
            <div className="team-member">
              <img className="photo" src={Staali} loading="lazy" alt="staali" />
              <div className="some-infos">
                <span className="name">Mohamed Amine Staali</span>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={20}
                    width={20}
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z"
                    />
                  </svg>
                  <span className="profession">Engineering student</span>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={20}
                    width={20}
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                    />
                  </svg>
                  <span className="email">mohamedamine.staali@ensi-uma.tn</span>
                </div>
              </div>
            </div>
            <div className="team-member">
              <img className="photo" src={Wiem} loading="lazy" alt="wiem" />
              <div className="some-infos">
                <span className="name">Wiem Hajjy</span>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={20}
                    width={20}
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z"
                    />
                  </svg>
                  <span className="profession">Engineering student</span>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={20}
                    width={20}
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#ffffff"
                      d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                    />
                  </svg>
                  <span className="email">mohamedamine.staali@ensi-uma.tn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUS;
