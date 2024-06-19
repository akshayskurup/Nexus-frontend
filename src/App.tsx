import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import './App.css'
import UserRoute from "./routes/userRoute";
import AdminRoute from "./routes/adminRoute";

function App() {
  
  return (
    <div>
<Router>
  <Routes>
    <Route path='/*' element={<UserRoute />} ></Route>

    <Route path="/admin/*" element={<AdminRoute />} />
  </Routes>
</Router>
    </div>
  );
}

export default App
