import "../../style/css/LoginView.css";
import { useEffect, useState, useContext } from "react";
import motivation from "../../assets/motivation.jpeg";
import Checkbox from "../decorative_elements/Checkbox";
import { CheckboxContext } from "../../Contexts/CheckboxContext";
import { UserInfosContext } from "../../Contexts/UserInfosContext";
import { AuthContext } from "../../Contexts/AuthContext";
import Modal from "react-modal";
import ClipLoader from "react-spinners/ClipLoader";

export default function LoginView() {
  /*Entry animation*/
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, [isVisible]);

  /*Email verification*/
  const ValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  const [isEmailValid, setIsEmailValid] = useState(true);
  /*passwords match verification*/
  const [PassMatch, setPassMatch] = useState(true);
  const [isPass, setisPass] = useState(true);
  /*----------------------------------------------------------------------*/
  const {
    welcomeMsg,
    setWelcomeMsg,
    loading,
    isLogin,
    setisLogin,
    setIsHealthForm,
    username,
    setUserName,
    email,
    setEmail,
    pass,
    setPass,
    pass2,
    setPass2,
  } = useContext(UserInfosContext);
  /*----------------------------------------------------------------------*/
  const { handleLogin } = useContext(AuthContext);
  /*----------------------------------------------------------------------*/
  /* Modal style */
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent black background
      backdropFilter: "blur(5px)", // Blur effect
    },
    content: {
      top: "10%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      minWidth: "240px",
      borderRadius: "10px",
      color: "#333",
      opacity: 0, // Start with opacity 0
      animation: "popup 0.3s forwards",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  };
  const SpinnerStyle = {
    display: "block",
    margin: "0px",
    borderColor: "red",
  };
  /*----------------------------------------------------------------------*/
  useEffect(() => {
    if (welcomeMsg) {
      setModalIsOpen(true);
      setModalContent("Welcome aboard! Ready to level up ?");
      setWelcomeMsg(false);
    }
  }, [loading, setWelcomeMsg, welcomeMsg]);
  /*----------------------------------------------------------------------*/
  const handleNextSection = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isEmailValid) {
      setModalIsOpen(true);
      setModalContent("E-mail address is not valid");
    } else if (!PassMatch) {
      setModalIsOpen(true);
      setModalContent("passwords don't match");
    } else if (
      username.trim().length >= 5 &&
      isEmailValid &&
      pass.trim().length >= 10 &&
      pass2.trim().length >= 10 &&
      pass === pass2 &&
      PassMatch
    ) {
      setIsHealthForm(true);
    }
  };
  /*----------------------------------------------------------------------*/
  return (
    <>
      <Modal
        isOpen={loading}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
        contentLabel="Example Modal"
      >
        <div className="spinnerContent">
          <ClipLoader
            color="#333"
            loading={loading}
            cssOverride={SpinnerStyle}
            size={40}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <h4 style={{ textAlign: "center" }}>
            Generating your new workout program...
          </h4>
        </div>
      </Modal>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            zIndex: 9999,
          }}
        ></div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Example Modal"
      >
        <button className="modalButton" onClick={() => setModalIsOpen(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="18"
            viewBox="0 0 384 512"
          >
            <path
              fill="#000000"
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
          </svg>
        </button>
        <h4 style={{ textAlign: "center" }}>{modalContent}</h4>
      </Modal>
      {isLogin ? (
        <div
          className={`account-container ${
            isVisible ? "account-visible" : "acount-fade-in"
          }`}
        >
          <div className="account-left-container">
            <span id="title">
              <span className="title-deco">Ready to</span> level up <br /> your
              body <span className="title-deco">with us?</span>
            </span>
            <form
              className="accountForm"
              onSubmit={async (e) => {
                const output = await handleLogin(e, email, pass);
                if (output == "error") {
                  setModalIsOpen(true);
                  setModalContent("Email or password incorrect.");
                }
              }}
            >
              <input
                className="AccountsInput"
                maxLength={40}
                type="email"
                name="Email"
                placeholder="@ Email..."
                value={email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
                required
              />
              <div className="pass">
                <input
                  className="AccountsInput"
                  maxLength={30}
                  type={isPass ? "password" : "text"}
                  name="pass1"
                  placeholder="Password..."
                  value={pass}
                  onChange={(e) => {
                    setPass(e.currentTarget.value);
                  }}
                  required
                />
                <CheckboxContext.Provider value={{ isPass, setisPass }}>
                  <Checkbox />
                </CheckboxContext.Provider>
              </div>
              <button type="submit" className="Button">
                Log in
              </button>
            </form>
            <span
              className="ChangePage"
              onClick={() => {
                setisLogin(!isLogin);
                setisPass(true);
              }}
            >
              Don't Have an account ? <b>Join Here</b>
            </span>
          </div>
          <img
            className="account-right-container"
            src={motivation}
            alt="motivation"
          />
        </div>
      ) : (
        <div
          className={`account-container ${
            isVisible ? "account-visible" : "acount-fade-in"
          }`}
        >
          <div className="account-left-container">
            <span id="title">
              <span className="title-deco">Ready to</span> level up <br /> your
              body <span className="title-deco">with us?</span>
            </span>
            <form className="accountForm" onSubmit={handleNextSection}>
              <input
                className="AccountsInput"
                maxLength={40}
                minLength={5}
                type="text"
                name="Username"
                placeholder="FullName..."
                value={username}
                onChange={(e) => {
                  setUserName(e.currentTarget.value);
                }}
                required
              />

              <input
                className="AccountsInput"
                maxLength={40}
                type="email"
                name="Email"
                placeholder="@ Email..."
                value={email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                  setIsEmailValid(ValidEmail(e.currentTarget.value));
                }}
                required
              />

              <div className="pass">
                <input
                  className="AccountsInput"
                  maxLength={30}
                  minLength={10}
                  type={isPass ? "password" : "text"}
                  name="pass1"
                  placeholder="Password..."
                  value={pass}
                  onChange={(e) => {
                    setPass(e.currentTarget.value);
                    if (e.currentTarget.value != pass2 && pass2 != "") {
                      setPassMatch(false);
                    } else {
                      setPassMatch(true);
                    }
                  }}
                  required
                />
                <CheckboxContext.Provider value={{ isPass, setisPass }}>
                  <Checkbox />
                </CheckboxContext.Provider>
              </div>

              <input
                className="AccountsInput"
                maxLength={30}
                minLength={10}
                type={isPass ? "password" : "text"}
                name="pass2"
                placeholder="Repeat Password..."
                value={pass2}
                onChange={(e) => {
                  setPass2(e.currentTarget.value);
                  if (e.currentTarget.value != pass) {
                    setPassMatch(false);
                  } else {
                    setPassMatch(true);
                  }
                }}
                required
              />

              <button type="submit" className="Button">
                <span style={{ marginRight: "10px" }}>Next</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  width="20"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#ffffff"
                    d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM294.6 135.1c-4.2-4.5-10.1-7.1-16.3-7.1C266 128 256 138 256 150.3V208H160c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h96v57.7c0 12.3 10 22.3 22.3 22.3c6.2 0 12.1-2.6 16.3-7.1l99.9-107.1c3.5-3.8 5.5-8.7 5.5-13.8s-2-10.1-5.5-13.8L294.6 135.1z"
                  />
                </svg>
              </button>
            </form>

            <span
              className="ChangePage"
              onClick={() => {
                setisLogin(!isLogin);
                setisPass(true);
              }}
            >
              Already Have an account ? <b>Join Here</b>
            </span>
          </div>
          <img
            className="account-right-container"
            src={motivation}
            alt="motivation"
          />
        </div>
      )}
    </>
  );
}
