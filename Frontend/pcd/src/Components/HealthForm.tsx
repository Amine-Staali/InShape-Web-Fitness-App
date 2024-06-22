import { useState, useContext } from "react";
import "../style/css/HealthForm.css";
import { UserInfosContext } from "../Contexts/UserInfosContext";
import Modal from "react-modal";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../Contexts/AuthContext";

function HealthForm() {
  /*if the user is logged in he can retake this health check*/
  const { user } = useContext(AuthContext);

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

  /*to change the layer*/
  const {
    loading,
    handleHealthForm,
    setisLogin,
    setIsHealthForm,
    setID,
    setNewUserCreated,
    setAge,
    setHeight,
    setHeightUnit,
    setWeight,
    setWeightUnit,
    setHealthConditions,
    setMedications,
    setAllergies,
    setInjuries,
    setExperienceLevel,
    setFitnessGoals,
    setActivityLevel,
    setWorkoutTime,
    username,
    email,
    pass,
    age,
    height,
    heightUnit,
    weight,
    weightUnit,
    healthConditions,
    medications,
    allergies,
    injuries,
    experienceLevel,
    fitnessGoals,
    activityLevel,
    workoutTime,
  } = useContext(UserInfosContext);

  const handleFitnessGoals = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFitnessGoals((prevFitnessGoals: string[]) => {
        return [...prevFitnessGoals, value];
      });
    } else {
      setFitnessGoals((prevFitnessGoals: string[]) => {
        return prevFitnessGoals.filter((goal: string) => goal !== value);
      });
    }
  };

  const handleHealthConditions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      if (healthConditions.includes("healthy")) {
        e.target.checked = false;
      } else {
        value == "healthy"
          ? setHealthConditions(["healthy"])
          : setHealthConditions((prevFitnessGoals: string[]) => {
              return [...prevFitnessGoals, value];
            });
      }
    } else {
      setHealthConditions((prevFitnessGoals: string[]) => {
        return prevFitnessGoals.filter((goal: string) => goal !== value);
      });
    }
  };

  function cleanText(text: string): string {
    // Split the text into lines
    const lines = text.split("\n");
    // Remove leading and trailing whitespace from each line
    const trimmedLines = lines.map((line) => line.trim());
    // Remove empty lines
    const nonEmptyLines = trimmedLines.filter((line) => line !== "");
    // Join the lines back together without adding newline characters
    const cleanedText = nonEmptyLines.join(" ");
    return cleanedText;
  }

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (healthConditions.length === 0) {
      setModalIsOpen(true);
      setModalContent("Please select at least one health condition");
    } else if (experienceLevel === "") {
      setModalIsOpen(true);
      setModalContent("Please select your experience level");
    } else if (fitnessGoals.length === 0) {
      setModalIsOpen(true);
      setModalContent("Please select at least one fitness goal");
    } else if (activityLevel === "") {
      setModalIsOpen(true);
      setModalContent("Please select your activity level");
    } else if (workoutTime === "") {
      setModalIsOpen(true);
      setModalContent("Please select your preferred workout time");
    } else {
      const data = {
        username: username,
        email: email,
        password: pass,
        age: age,
        height: height,
        heightUnit: heightUnit,
        weight: weight,
        weightUnit: weightUnit,
        healthConditions: healthConditions,
        medications: cleanText(medications),
        allergies: cleanText(allergies),
        injuries: cleanText(injuries),
        experienceLevel: experienceLevel,
        fitnessGoals: fitnessGoals,
        activityLevel: activityLevel,
        workoutTime: workoutTime,
      };
      const handleRegistration = async (user_data: typeof data) => {
        const response = await fetch(
          import.meta.env.VITE_REACT_APP_USER_REGISTER_API,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(user_data),
          }
        );
        const received_data = await response.json();

        if (response.status == 201) {
          setID(received_data.id);
          setisLogin(true);
          setNewUserCreated(true);
          setIsHealthForm(false);
        } else {
          setModalIsOpen(true);
          setModalContent("Something went wrong. Try changing the email. If the problem persists, reload the page.");
        }
      };
      if (user) {
        const myPromise = handleHealthForm();
        myPromise.then(
          () => {
            window.location.reload();
          },
          (error) => {
            console.error(`Promise rejected with error: ${error}`);
          }
        );
      } else {
        handleRegistration(data);
      }
    }
  };

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
      <form onSubmit={handleFormSubmit} className="HealthForm">
        {user ? null : (
          <button
            type="button"
            className="GoBackButton"
            onClick={() => {
              setisLogin(false);
              setIsHealthForm(false);
            }}
          >
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
            Back
          </button>
        )}

        <span id="title" className="HealthFormTitle">
          <span className="title-deco">Health </span>Check
        </span>
        <div className="insideFormContainer">
          {/* Age */}
          {user ? null : (
            <>
              <div className="HealthFormItem">
                <span>Age</span>
                <input
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  minLength={2}
                  maxLength={2}
                  value={age}
                  required
                  onChange={(e) => {
                    setAge(e.currentTarget.value);
                  }}
                />
              </div>
              {/* Height */}
              <div className="organizeInput">
                <div className="HealthFormItem">
                  <span>Height</span>
                  <input
                    type="number"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    name="height"
                    value={height}
                    required
                    onChange={(e) => {
                      setHeight(e.currentTarget.value);
                    }}
                  />
                </div>
                <div className="organizeSelectionInput">
                  <label htmlFor="cm">
                    <input
                      type="radio"
                      name="heightUnit"
                      checked={heightUnit === "cm"}
                      value={"cm"}
                      onChange={(e) => {
                        setHeightUnit(e.currentTarget.value);
                      }}
                    />
                    centimeters
                  </label>
                  <label htmlFor="m">
                    <input
                      type="radio"
                      name="heightUnit"
                      checked={heightUnit === "m"}
                      value={"m"}
                      onChange={(e) => {
                        setHeightUnit(e.currentTarget.value);
                      }}
                    />
                    meters
                  </label>
                  <label htmlFor="foot">
                    <input
                      type="radio"
                      name="heightUnit"
                      checked={heightUnit === "foot"}
                      value={"foot"}
                      onChange={(e) => {
                        setHeightUnit(e.currentTarget.value);
                      }}
                    />
                    foot
                  </label>
                </div>
              </div>
              {/* Weight */}
              <div className="HealthFormItem">
                <span>Weight</span>
                <div className="organizeSelectionInput">
                  <input
                    type="number"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    name="weight"
                    value={weight}
                    required
                    onChange={(e) => {
                      setWeight(e.currentTarget.value);
                    }}
                  />
                  <label htmlFor="Kg">
                    <input
                      type="radio"
                      name="weightUnit"
                      checked={weightUnit === "kg"}
                      value={"kg"}
                      onChange={(e) => {
                        setWeightUnit(e.currentTarget.value);
                      }}
                    />
                    Kg
                  </label>
                  <label htmlFor="lbs">
                    <input
                      type="radio"
                      name="weightUnit"
                      checked={weightUnit === "lbs"}
                      value={"lbs"}
                      onChange={(e) => {
                        setWeightUnit(e.currentTarget.value);
                      }}
                    />
                    lbs
                  </label>
                </div>
              </div>
            </>
          )}
          {/*Health history*/}
          <label htmlFor="healthHistory" className="multiSelectInputField">
            <span className="multiSelectInputField-title">
              Health conditions :
            </span>
            <div className="multiSelectInput">
              <label htmlFor="Healthy" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={healthConditions.includes("healthy")}
                  value={"healthy"}
                  onChange={handleHealthConditions}
                />
                <span className="multiselectItem">Healthy</span>
              </label>
              <label htmlFor="Diabetes" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={healthConditions.includes("diabetes")}
                  value={"diabetes"}
                  onChange={handleHealthConditions}
                />
                <span className="multiselectItem">Diabetes</span>
              </label>
              <label htmlFor="Hypertension" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={healthConditions.includes("hypertension")}
                  value={"hypertension"}
                  onChange={handleHealthConditions}
                />
                <span className="multiselectItem">Hypertension</span>
              </label>
              <label htmlFor="Heart disease" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={healthConditions.includes("heart disease")}
                  value={"heart disease"}
                  onChange={handleHealthConditions}
                />
                <span className="multiselectItem">Heart disease</span>
              </label>
              <label htmlFor="Asthma" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={healthConditions.includes("asthma")}
                  value={"asthma"}
                  onChange={handleHealthConditions}
                />
                <span className="multiselectItem">Asthma</span>
              </label>
              <label htmlFor="Arthritis" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={healthConditions.includes("arthritis")}
                  value={"arthritis"}
                  onChange={handleHealthConditions}
                />
                <span className="multiselectItem">Arthritis</span>
              </label>
              <label htmlFor="Cancer" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={healthConditions.includes("cancer")}
                  value={"cancer"}
                  onChange={handleHealthConditions}
                />
                <span className="multiselectItem">Cancer</span>
              </label>
            </div>
          </label>
          {/* Medications */}
          <div className="HealthFormItem">
            <label htmlFor="medications" className="textareaFields">
              <span>Current Medications :</span>
              <textarea
                name="medications"
                value={medications}
                placeholder="If you are not receiving any medical treatment, please write no current medications"
                required
                onChange={(e) => {
                  setMedications(e.currentTarget.value);
                }}
              ></textarea>
            </label>
          </div>
          {/* Allergies */}
          <div className="HealthFormItem">
            <label htmlFor="allergies" className="textareaFields">
              <span>Allergies or dietary restrictions :</span>
              <textarea
                name="Allergies"
                value={allergies}
                placeholder="If you don't have any allergies or dietary restrictions, please write no allergies"
                required
                onChange={(e) => {
                  setAllergies(e.currentTarget.value);
                }}
              ></textarea>
            </label>
          </div>
          {/* Injuries */}
          <div className="HealthFormItem">
            <label htmlFor="injuries" className="textareaFields">
              <span>previous injuries or surgeries :</span>
              <textarea
                name="injuries"
                value={injuries}
                placeholder="If you don't have previous injuries or surgeries relevant to exercise, please write no injuries"
                required
                onChange={(e) => {
                  setInjuries(e.currentTarget.value);
                }}
              ></textarea>
            </label>
          </div>
          {/* Beginner or advanced */}
          <label htmlFor="experienceLevel" className="multiSelectInputField">
            <span className="multiSelectInputField-title">
              Select Experience Level :
            </span>
            <div className="multiSelectInput newFlex">
              <label htmlFor="Beginner" className="HealthFormCheckbox">
                <input
                  type="radio"
                  name="experienceLevel"
                  checked={experienceLevel === "beginner"}
                  value={"beginner"}
                  onChange={(e) => {
                    setExperienceLevel(e.currentTarget.value);
                  }}
                />
                <span className="multiselectItem">Beginner</span>
              </label>
              <label htmlFor="Professional" className="HealthFormCheckbox">
                <input
                  type="radio"
                  name="experienceLevel"
                  checked={experienceLevel === "professional"}
                  value={"professional"}
                  onChange={(e) => {
                    setExperienceLevel(e.currentTarget.value);
                  }}
                />
                <span className="multiselectItem">Professional</span>
              </label>
            </div>
          </label>
          {/* Fitness goals */}
          <label htmlFor="fitnessGoals" className="multiSelectInputField">
            <span className="multiSelectInputField-title">
              Choose your fitness goal :
            </span>
            <div className="multiSelectInput">
              <label htmlFor="Weight loss" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={fitnessGoals.includes("weight loss")}
                  value={"weight loss"}
                  onChange={handleFitnessGoals}
                />
                <span className="multiselectItem">Weight loss</span>
              </label>
              <label htmlFor="Weight gain" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={fitnessGoals.includes("weight gain")}
                  value={"weight gain"}
                  onChange={handleFitnessGoals}
                />
                <span className="multiselectItem">Weight gain</span>
              </label>
              <label htmlFor="Maintenance" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={fitnessGoals.includes("maintenance")}
                  value={"maintenance"}
                  onChange={handleFitnessGoals}
                />
                <span className="multiselectItem">Maintenance</span>
              </label>
              <label htmlFor="Muscle building" className="HealthFormCheckbox">
                <input
                  type="checkbox"
                  checked={fitnessGoals.includes("muscle building")}
                  value={"muscle building"}
                  onChange={handleFitnessGoals}
                />
                <span className="multiselectItem">Muscle building</span>
              </label>
              <label
                htmlFor="Improved cardiovascular health"
                className="HealthFormCheckbox"
              >
                <input
                  type="checkbox"
                  checked={fitnessGoals.includes(
                    "improved cardiovascular health"
                  )}
                  value={"improved cardiovascular health"}
                  onChange={handleFitnessGoals}
                />
                <span className="multiselectItem">
                  Improved cardiovascular health
                </span>
              </label>
              <label
                htmlFor="General fitness and flexibility"
                className="HealthFormCheckbox"
              >
                <input
                  type="checkbox"
                  checked={fitnessGoals.includes(
                    "general fitness and flexibility"
                  )}
                  value={"general fitness and flexibility"}
                  onChange={handleFitnessGoals}
                />
                <span className="multiselectItem">
                  General fitness and flexibility
                </span>
              </label>
            </div>
          </label>
          {/* Activity Level */}
          <label htmlFor="activityLevel" className="multiSelectInputField">
            <span className="multiSelectInputField-title">
              Rate your activity level :
            </span>
            <div className="multiSelectInput newFlex">
              <label htmlFor="Sedentary" className="HealthFormCheckbox">
                <input
                  type="radio"
                  name="activityLevel"
                  checked={activityLevel === "Sedentary"}
                  value={"Sedentary"}
                  onChange={(e) => {
                    setActivityLevel(e.currentTarget.value);
                  }}
                />
                <span className="multiselectItem">Sedentary</span>
              </label>
              <label htmlFor="Lightly active" className="HealthFormCheckbox">
                <input
                  type="radio"
                  name="activityLevel"
                  checked={activityLevel === "Lightly active"}
                  value={"Lightly active"}
                  onChange={(e) => {
                    setActivityLevel(e.currentTarget.value);
                  }}
                />
                <span className="multiselectItem">Lightly active</span>
              </label>
              <label htmlFor="Moderately active" className="HealthFormCheckbox">
                <input
                  type="radio"
                  name="activityLevel"
                  checked={activityLevel === "Moderately active"}
                  value={"Moderately active"}
                  onChange={(e) => {
                    setActivityLevel(e.currentTarget.value);
                  }}
                />
                <span className="multiselectItem">Moderately active</span>
              </label>
              <label htmlFor="Very active" className="HealthFormCheckbox">
                <input
                  type="radio"
                  name="activityLevel"
                  checked={activityLevel === "Very active"}
                  value={"Very active"}
                  onChange={(e) => {
                    setActivityLevel(e.currentTarget.value);
                  }}
                />
                <span className="multiselectItem">Very active</span>
              </label>
            </div>
          </label>
          {/* Workout Time */}
          <label htmlFor="workoutTimes" className="multiSelectInputField">
            <span className="multiSelectInputField-title">
              Choose your preferred workout time :
            </span>
            <div className="multiSelectInput newFlex">
              <label htmlFor="Morning" className="HealthFormCheckbox">
                <input
                  type="radio"
                  name="workoutTimes"
                  checked={workoutTime === "Morning"}
                  value={"Morning"}
                  onChange={(e) => {
                    setWorkoutTime(e.currentTarget.value);
                  }}
                />
                <span className="multiselectItem">Morning</span>
              </label>
              <label htmlFor="Afternoon" className="HealthFormCheckbox">
                <input
                  type="radio"
                  name="workoutTimes"
                  checked={workoutTime === "Afternoon"}
                  value={"Afternoon"}
                  onChange={(e) => {
                    setWorkoutTime(e.currentTarget.value);
                  }}
                />
                <span className="multiselectItem">Afternoon</span>
              </label>
              <label htmlFor="Evening" className="HealthFormCheckbox">
                <input
                  type="radio"
                  name="workoutTimes"
                  checked={workoutTime === "Evening"}
                  value={"Evening"}
                  onChange={(e) => {
                    setWorkoutTime(e.currentTarget.value);
                  }}
                />
                <span className="multiselectItem">Evening</span>
              </label>
            </div>
          </label>
          <span id="title" className="HealthFormFinished">
            <span className="title-deco">Thank you</span> For <br />
            <span className="title-deco">your patience</span>
          </span>
          <button type="submit" className="HealthFormSubmit-Button">
            Let's workout
          </button>
        </div>
      </form>
    </>
  );
}

export default HealthForm;
