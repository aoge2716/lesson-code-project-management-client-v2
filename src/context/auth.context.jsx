import {useState, useEffect, createContext} from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";

const API_URL  = "http://localhost:5005";
const AuthContext = createContext();

function AuthProviderWrapper(props){
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token) =>{
    localStorage.setItem('authToken', token);
  }

  const authenticateUser = async ()=>{
    const storedToken = localStorage.getItem('authToken');

    if(storedToken){
      try {
        const response = await axios.get(
          `${API_URL}/auth/verify`,
          {headers: {Authorization: `Brearer ${storedToken}`}}
        )
        console.log("authenticated")
        const user = response.data;

        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(user);

      } catch (error) {
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
        console.log("invalid token", error);
      }

    }else{
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      console.log("!storedToken", error)
    }
  }

  const removeToken = ()=>{
    localStorage.removeItem("authToken")
  }

  const logOutUser = ()=>{
    removeToken();
    authenticateUser();
  }


  useEffect(()=>{
    authenticateUser();
  },[])

  return(
    <AuthContext.Provider 
      value ={{
        isLoggedIn, 
        isLoading, 
        user, 
        storeToken,
        authenticateUser,
        logOutUser,
        
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export {AuthProviderWrapper, AuthContext}