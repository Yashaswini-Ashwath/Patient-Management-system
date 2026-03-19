//Login page for doctors

import  {useState} from "react";
import { loginAPI } from "../api/authApi";

export default function Login() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    
    const handleLogin = async () => {
        try{
            const res = await loginAPI(email, password);
            localStorage.setItem("token", res.token);
            window.location.href = "/patients";
        }
        catch{
            alert("Invalid login");
        }
    };

    return(
        <div style={{padding:20}}>
            <h2>Doctor Login</h2>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
        </div>

    )
}