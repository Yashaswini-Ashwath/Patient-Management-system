//API calls related to authentication
const API= "http://localhost:4000";
import axios from "axios";
export const loginAPI = async(email: string, password: string) => {
 const res = await axios.post(`${API}/auth/login`, {email, password}); 
 return res.data;

};


