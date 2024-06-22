import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import SideProfile from "../Components/SideProfile";
import HealthForm from "../Components/HealthForm";
import Navbar from "../Components/Navbar";
import "../style/css/Profile.css";
import QuoteIcon from "../assets/Quote_icon.png";

interface Exercise {
  name: string;
  reps: number;
  sets: number;
}
interface meal {
  meal_type: string;
  description: string;
}

interface DailyWorkout {
  day: string;
  workout: Exercise[];
  meals: meal[];
}

function Profile() {
  /*Entry animation*/
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, [isVisible]);

  const { user, authTokens, handleLogout } = useContext(AuthContext);
  const [weeklyWorkout, setWeeklyWorkout] = useState(null);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const renderAfterCalled = useRef(false);

  //Chiffrer le token

  useEffect(() => {
    if (!renderAfterCalled.current) {
      (async () => {
        try {
          const response1 = await fetch(
            import.meta.env.VITE_REACT_APP_QUOTE_API,
            {
              method: "GET",
              headers: {
                "X-Api-Key": import.meta.env.VITE_REACT_APP_QUOTE_API_KEY,
                "Content-Type": "application/json",
              },
            }
          );
          const quoteData = await response1.json();
          if (response1.ok) {
            setQuote(quoteData[0]["quote"]);
            setAuthor(quoteData[0]["author"]);
          } else {
            handleLogout();
          }

          const response2 = await fetch(
            import.meta.env.VITE_REACT_APP_WEEKLY_WORKOUT_API,
            {
              method: "GET",
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authTokens.access}`,
              },
            }
          );
          const weeklyWorkoutData = await response2.json();
          if (response2.ok) {
            setWeeklyWorkout(weeklyWorkoutData);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      })();
    }
    renderAfterCalled.current = true;
    window.scrollTo(0, 0);
  }, [authTokens.access, handleLogout, user]);

  //Clock settings
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const tick = () => {
    setDate(new Date());
  };

  const format = (val: number): string => {
    return val < 10 ? "0" + val : val.toString();
  };

  return (
    <>
      <Navbar />
      <div
        className={`profile-container ${
          isVisible ? "Profile-after" : "Profile-before"
        }`}
      >
        <div className="TopSection">
          <SideProfile />
          <div className="workout-section">
            <div className="TwoBlocks">
              <div className="Clock">
                <p>{`${date.getHours()} : ${format(
                  date.getMinutes()
                )}`}<span> : {format(date.getSeconds())}</span></p>
              </div>
              {quote ? (
                <div className="Quotes">
                  <div className="insideQuote">
                    <div className="QuoteTitle">
                      <img src={QuoteIcon} className="QuoteIcon rotateIcon" />
                      <span>Quote</span>
                      <img src={QuoteIcon} className="QuoteIcon" />
                    </div>
                    {quote}
                    <small>- {author} -</small>
                  </div>
                </div>
              ) : (
                <div className="Quotes">
                  <div className="insideQuote Loading">
                    <h1>Loading...</h1>
                  </div>
                </div>
              )}
            </div>
            {weeklyWorkout ? (
              <>
                <div className="workout-program">
                  <span className="title-workout-program">
                    <span className="title-deco">Workout</span> Program
                  </span>
                  <div className="inside-workout-program">
                    {weeklyWorkout.daily_workouts.map(
                      (dailyWorkout: DailyWorkout, workoutIndex: number) => (
                        <div key={dailyWorkout.day} className="dailyWorkout">
                          {dailyWorkout.workout[0].name === "Rest day" ? (
                            <span className="day">{dailyWorkout.day}</span>
                          ) : (
                            <a
                              href={`http://127.0.0.1:8000/second_phase/exercise_analysis/${workoutIndex}/0/?q=${authTokens.access}`}
                            >
                              <span className="day">{dailyWorkout.day}</span>
                            </a>
                          )}

                          <ul className="List-exercises">
                            {dailyWorkout.workout.map((exercise, index) =>
                              exercise.name === "Rest day" ? (
                                <li
                                  key={index}
                                  className="exercise addborderRadius"
                                >
                                  <span className="exercise-name">
                                    {exercise.name}
                                  </span>
                                </li>
                              ) : (
                                <div key={index}>
                                  <a
                                    href={`http://127.0.0.1:8000/second_phase/exercise_analysis/${workoutIndex}/${index}/?q=${authTokens.access}`}
                                  >
                                    <li
                                      key={index}
                                      className={`exercise ${
                                        index ===
                                        dailyWorkout.workout.length - 1
                                          ? "addborderRadius"
                                          : ""
                                      }`}
                                    >
                                      <span className="exercise-name">
                                        {exercise.name}
                                      </span>
                                      <span className="exercise-process">
                                        {exercise.reps} Reps, {exercise.sets}{" "}
                                        Sets
                                      </span>
                                    </li>
                                  </a>
                                </div>
                              )
                            )}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="workout-program">
                  <span className="title-workout-program">
                    <span className="title-deco">Workout</span> Program
                  </span>
                  <div className="inside-workout-program Loading">
                    <h1>Loading...</h1>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="BottomSection">
          {weeklyWorkout ? (
            <>
              <div className="meals-program">
                <span className="title-workout-program">
                  <span className="title-deco">Meals</span> Program
                </span>
                <div className="inside-meals-program">
                  {weeklyWorkout.daily_workouts.map(
                    (dailyWorkout: DailyWorkout) => (
                      <div key={dailyWorkout.day} className="dailyWorkout">
                        <span className="day">{dailyWorkout.day}</span>
                        <ul className="List-exercises">
                          {dailyWorkout.meals.map((meal, index) => (
                            <li key={index} className="meal addborderRadius">
                              <span className="exercise-name">
                                {meal.meal_type}
                              </span>
                              <br />
                              <span className="exercise-process">
                                <b className="prep">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="14"
                                    width="14"
                                    viewBox="0 0 512 512"
                                  >
                                    <path
                                      fill="#333"
                                      d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
                                    />
                                  </svg>{" "}
                                  Prep :
                                </b>{" "}
                                {meal.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="meals-program">
                <span className="title-workout-program">
                  <span className="title-deco">Meals</span> Program
                </span>
                <div className="inside-meals-program Loading">
                  <h1>Loading...</h1>
                </div>
              </div>
            </>
          )}
          <HealthForm />
        </div>
      </div>
    </>
  );
}

export default Profile;
