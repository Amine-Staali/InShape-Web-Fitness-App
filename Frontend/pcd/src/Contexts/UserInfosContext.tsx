import { jwtDecode } from "jwt-decode";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

// Define the context type
interface UserInfosContextType {
  handleHealthForm?: () => Promise<string>;
  loading?: boolean;
  welcomeMsg?: boolean;
  setWelcomeMsg?: React.Dispatch<React.SetStateAction<boolean>>;
  isLogin?: boolean;
  setisLogin?: React.Dispatch<React.SetStateAction<boolean>>;
  isHealthForm?: boolean;
  setIsHealthForm?: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
  setID?: React.Dispatch<React.SetStateAction<number>>;
  newUserCreated?: boolean;
  setNewUserCreated?: (val: boolean) => void;
  username?: string;
  setUserName?: React.Dispatch<React.SetStateAction<string>>;
  email?: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  pass?: string;
  setPass?: React.Dispatch<React.SetStateAction<string>>;
  pass2?: string;
  setPass2?: React.Dispatch<React.SetStateAction<string>>;
  age?: string;
  setAge?: React.Dispatch<React.SetStateAction<string>>;
  height?: string;
  setHeight?: React.Dispatch<React.SetStateAction<string>>;
  heightUnit?: string;
  setHeightUnit?: React.Dispatch<React.SetStateAction<string>>;
  weight?: string;
  setWeight?: React.Dispatch<React.SetStateAction<string>>;
  weightUnit?: string;
  setWeightUnit?: React.Dispatch<React.SetStateAction<string>>;
  healthConditions?: string[];
  setHealthConditions?: React.Dispatch<React.SetStateAction<string[]>>;
  medications?: string;
  setMedications?: React.Dispatch<React.SetStateAction<string>>;
  allergies?: string;
  setAllergies?: React.Dispatch<React.SetStateAction<string>>;
  injuries?: string;
  setInjuries?: React.Dispatch<React.SetStateAction<string>>;
  experienceLevel?: string;
  setExperienceLevel?: React.Dispatch<React.SetStateAction<string>>;
  fitnessGoals?: string[];
  setFitnessGoals?: React.Dispatch<React.SetStateAction<string[]>>;
  activityLevel?: string;
  setActivityLevel?: React.Dispatch<React.SetStateAction<string>>;
  workoutTime?: string;
  setWorkoutTime?: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
export const UserInfosContext = createContext<UserInfosContextType>({});

interface Props {
  children: ReactNode;
  additionalValues?: {
    isLogin: boolean;
    setisLogin: React.Dispatch<React.SetStateAction<boolean>>;
    isHealthForm: boolean;
    setIsHealthForm: React.Dispatch<React.SetStateAction<boolean>>;
  };
}
export const UserInfosProvider = ({ children, additionalValues }: Props) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);
  const [welcomeMsg, setWelcomeMsg] = useState(false);

  const [newUserCreated, setNewUserCreated] = useState(false);
  const [id, setID] = useState<number | undefined>(user?.user_id);

  /*Login View Inputs*/
  const [username, setUserName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  /*Health form inputs*/
  const [age, setAge] = useState(user?.age || "");
  const [height, setHeight] = useState(user?.height || "");
  const [heightUnit, setHeightUnit] = useState(user?.heightUnit || "cm");
  const [weight, setWeight] = useState(user?.weight || "");
  const [weightUnit, setWeightUnit] = useState(user?.weightUnit || "kg");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [injuries, setInjuries] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState("");
  const [workoutTime, setWorkoutTime] = useState("");

  const createWeeklyWorkout = useCallback(
    async (FetchMethod: string) => {
      setLoading(true);
      try {
        const form_data = {
          user_id: id,
          email: email,
          username: username,
          age: age,
          height: height,
          heightUnit: heightUnit,
          weight: weight,
          weightUnit: weightUnit,
          healthConditions: healthConditions,
          medications: medications,
          allergies: allergies,
          injuries: injuries,
          experienceLevel: experienceLevel,
          fitnessGoals: fitnessGoals,
          activityLevel: activityLevel,
          workoutTime: workoutTime,
        };
        const response = await fetch(
          import.meta.env.VITE_REACT_APP_CREATE_PROGRAM_API,
          {
            method: FetchMethod,
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(form_data),
          }
        );
        const received_data = await response.json();
        if (response.status == 201) {
          localStorage.setItem(
            "authTokens",
            JSON.stringify(received_data.token)
          );
          localStorage.setItem(
            "user",
            JSON.stringify(jwtDecode(received_data.token.access))
          );
        }
        setLoading(false);
        return !loading;
      } catch (error) {
        console.log("Error creating weekly workout:", error);
      }
    },
    [
      activityLevel,
      age,
      allergies,
      email,
      experienceLevel,
      fitnessGoals,
      healthConditions,
      height,
      heightUnit,
      id,
      injuries,
      loading,
      medications,
      username,
      weight,
      weightUnit,
      workoutTime,
    ]
  );

  const handleHealthForm = async () => {
    await createWeeklyWorkout("PUT");
    setHealthConditions([]);
    setMedications("");
    setAllergies("");
    setInjuries("");
    setExperienceLevel("");
    setFitnessGoals([]);
    setActivityLevel("");
    setWorkoutTime("");
    return "Health form processing completed.";
  };

  useEffect(() => {
    const fetchData = async () => {
      if (newUserCreated) {
        try {
          const done = await createWeeklyWorkout("POST");
          if (done) {
            setWelcomeMsg(true);
            setNewUserCreated(false);
            setUserName("");
            setEmail("");
            setPass("");
            setPass2("");
            setAge("");
            setHeight("");
            setHeightUnit("cm");
            setWeight("");
            setWeightUnit("kg");
            setHealthConditions([]);
            setMedications("");
            setAllergies("");
            setInjuries("");
            setExperienceLevel("");
            setFitnessGoals([]);
            setActivityLevel("");
            setWorkoutTime("");
          }
        } catch (error) {
          console.error("Error creating weekly workout:", error);
        }
      }
    };

    fetchData();
  }, [createWeeklyWorkout, newUserCreated]);

  const contextData = {
    handleHealthForm: handleHealthForm,
    loading: loading,
    welcomeMsg: welcomeMsg,
    setWelcomeMsg: setWelcomeMsg,
    setID: setID,
    username: username,
    setUserName: setUserName,
    email: email,
    setEmail: setEmail,
    pass: pass,
    setPass: setPass,
    pass2: pass2,
    setPass2: setPass2,
    age: age,
    setAge: setAge,
    height: height,
    setHeight: setHeight,
    heightUnit: heightUnit,
    setHeightUnit: setHeightUnit,
    weight: weight,
    setWeight: setWeight,
    weightUnit: weightUnit,
    setWeightUnit: setWeightUnit,
    healthConditions: healthConditions,
    setHealthConditions: setHealthConditions,
    medications: medications,
    setMedications: setMedications,
    allergies: allergies,
    setAllergies: setAllergies,
    injuries: injuries,
    setInjuries: setInjuries,
    experienceLevel: experienceLevel,
    setExperienceLevel: setExperienceLevel,
    fitnessGoals: fitnessGoals,
    setFitnessGoals: setFitnessGoals,
    activityLevel: activityLevel,
    setActivityLevel: setActivityLevel,
    workoutTime: workoutTime,
    setWorkoutTime: setWorkoutTime,
    newUserCreated: newUserCreated,
    setNewUserCreated: setNewUserCreated,
    ...additionalValues,
  };

  return (
    <UserInfosContext.Provider value={contextData}>
      {children}
    </UserInfosContext.Provider>
  );
};
