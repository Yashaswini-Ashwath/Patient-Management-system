import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import PatientList from "./pages/PatientList";
import PatientEdit from "./pages/PatientEdit";
import PatientCreate from "./pages/PatientCreate";
import NotFound from "./pages/NotFound";
export default function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/patients" element={<PatientList/>} />
      <Route path="/patients/new" element={<PatientCreate />} />
      <Route path="/patients/:id" element={<PatientEdit/>} />     
      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  )
}