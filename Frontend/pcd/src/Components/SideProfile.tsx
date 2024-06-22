import "../style/css/Profile.css";
import { useContext, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import profileImageDeco from "../assets/profile_deco.png";

function SideProfile() {
  const { user, authTokens } = useContext(AuthContext);
  const [hiddenElement, setHiddenElement] = useState(true);
  const [age, setAge] = useState(user.age.toString());
  const [height, setHeight] = useState(user.height.toString());
  const [weight, setWeight] = useState(user.weight.toString());

  const updateProfile = async () => {
    try {
      const data = {
        age: age,
        height: height,
        weight: weight,
      };
      const response = await fetch(
        import.meta.env.VITE_REACT_APP_PROFILE_UPDATE_API,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(data),
        }
      );
      const received_data = await response.json();
      if (response.ok) {
        localStorage.setItem("authTokens", JSON.stringify(received_data.token));
        localStorage.setItem(
          "user",
          JSON.stringify(jwtDecode(received_data.token.access))
        );
        setHiddenElement(true);
      }
    } catch (error) {
      console.log("Something went wrong", error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="sideProfile">
        <svg
          className={`updateProfileIcon ${!hiddenElement ? "hidden" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          height="22"
          width="22"
          viewBox="0 0 512 512"
          onClick={() => {
            setHiddenElement(false);
          }}
        >
          <path
            fill="#ffffff"
            d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"
          />
        </svg>
        <span className="user_experience">{user.experienceLevel}</span>
        <span className="username">
          <span>
            <span className="title-deco">Welcome back,</span> {user.username} !
          </span>
        </span>
        <div className="inside-sideProfile">
          <div className="inside-inside-sideProfile">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className={`UpdateUserButtons ${hiddenElement ? "hidden" : ""}`}>
                <span
                  className="UpdateUserButton"
                  onClick={() => {
                    setHiddenElement(true);
                  }}
                >
                  Cancel
                </span>
                <span className="save UpdateUserButton" onClick={updateProfile}>
                  save
                </span>
              </div>
              <div className="user_profile_infos">
                <span className="label_userInfos">age: </span>
                <span className={` userInfos ${!hiddenElement ? "hidden" : ""}`}>
                  {age}
                </span>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className={` updateProfileInput ${hiddenElement ? "hidden" : ""}`}
                  value={age}
                  onChange={(e) => {
                    setAge(e.currentTarget.value);
                  }}
                />
              </div>
              <div className="user_profile_infos">
                <span className="label_userInfos">height: </span>
                <span className={` userInfos ${!hiddenElement ? "hidden" : ""}`}>
                  {height} {user.heightUnit}
                </span>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className={` updateProfileInput ${hiddenElement ? "hidden" : ""}`}
                  value={height}
                  onChange={(e) => {
                    setHeight(e.currentTarget.value);
                  }}
                />
              </div>
              <div className="user_profile_infos">
                <span className="label_userInfos">weight: </span>
                <span className={` userInfos ${!hiddenElement ? "hidden" : ""}`}>
                  {weight} {user.weightUnit}
                </span>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className={` updateProfileInput ${hiddenElement ? "hidden" : ""}`}
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.currentTarget.value);
                  }}
                />
              </div>
            </form>
            <div className="add_bg">
              <div className="label_userInfos">Fitness goals: </div>
              <div className="many_user_infos">
                {user.fitnessGoals.map((goal, index) => (
                  <span key={index} className="many_user_infos_item">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
            <div className="add_bg">
              <span className="label_userInfos">Health condition: </span>
              <div className="many_user_infos">
                {user.healthConditions.map((condition, index) => (
                  <span key={index} className="many_user_infos_item">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <img className="profileImageDeco" src={profileImageDeco} alt="" />
        </div>
      </div>
    </>
  );
}

export default SideProfile;
