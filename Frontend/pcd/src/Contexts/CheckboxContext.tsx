import { createContext } from "react";

interface isPassType{
    isPass?: boolean;
    setisPass?: (value: boolean) => void;
}

export const CheckboxContext = createContext<isPassType>({});
