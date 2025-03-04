import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function LoginPage(props){
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMeassage, setErrorMessage] = useState(undefined);

  const { storeToken, authenticateUser} = useContext(AuthContext);
  const navigate = useNavigate();
  

  const handleEmail  = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = async (e)=>{
    e.preventDefault();

    const requestBody = {email, password};

    try{
      const response = await axios.post(`${API_URL}/auth/login`, requestBody);
      console.log("JWT token:", response.data.authToken);
      
      storeToken(response.data.authToken);
      
      authenticateUser();
      
      navigate("/")
    }catch(error){
      const errorDescriptioin = error.response.data.message;
      setErrorMessage(errorDescriptioin); 
    }

  }

  return(
    <div className="LoginPage">
      <form onSubmit={handleLoginSubmit}>
        <label>Email: </label>
        <input type="email" name="email" value={email} onChange={handleEmail}/>
        
        <label>Passwrod:</label>
        <input type="password" name="password" value={password} onChange={handlePassword}/>
        
        <button>Login</button>
      </form>
      {errorMeassage && <p className="error-Message">{errorMeassage}</p>}
    </div>
  )
}

export default LoginPage;