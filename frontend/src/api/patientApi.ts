// API calls related to patients CRUD 

import axios from "axios";

const API= "http://localhost:4000";

//Helper to attach jwt token

const authHeader = (token: string) => {
return {headers: { Authorization: `Bearer ${token}`} }
};

//POST create new patient
export const createPatient = (token: string, data: any) =>
    axios.post(`${API}/patients`, data, authHeader(token));

//GET all patients
export const getPatients = (token: string) =>
    axios.get(`${API}/patients`, authHeader(token));

//GET single patient
export const getPatient = (token: string,  id: string) =>
    axios.get(`${API}/patients/${id}`, authHeader(token)); 

//PUT update existing patient
export const updatePatient = (token: string, id: string, data: any) =>
    axios.put(`${API}/patients/${id}`, data, authHeader(token));

//GET audit history
export const getHistory = (token: string, id: string) =>
    axios.get(`${API}/patients/${id}/history`, authHeader(token)); 