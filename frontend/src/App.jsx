import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookingPage from "./pages/BookingPage";  
import EditTripPage from "./pages/EditTripPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      {/* Layout is the parent route */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />  
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="services" element={<Services />} />
        <Route path="register" element={<Register />} />
        <Route path="book" element={<BookingPage />} />  
         <Route path="/edit-trip/:tripId" element={<EditTripPage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
