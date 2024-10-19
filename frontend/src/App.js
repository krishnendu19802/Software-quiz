import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Topics from "./Components/Topics/Topics";
import AddTopic from "./Components/addTopic/AddTopic";
import AddQuestion from "./Components/AddQuestion/AddQuestion";
import AddAdmin from "./Components/AddAdmin/AddAdmin";
import Quiz from "./Components/Quiz/Quiz";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import HomePage from "./Components/HomePage/HomePage";
import Navbar from "./Components/Navbar/Navbar";
import LeaderBoard from "./Components/LeaderBoard/LeaderBoard";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  // Hide Navbar on /login and /register routes
  const hideNavbarRoutes = ["/login", "/register", "/profile"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  // // Add blue background for all routes except HomePage and Login/Register
  // const blueBackgroundRoutes = [
  //   "/getTopics",
  //   "/quiz/:topicId",
  //   "/profile",
  //   "/addTopic",
  //   "/addQuestion",
  //   "/addAdmin",
  // ];
  // const shouldHaveBlueBackground = blueBackgroundRoutes.some((route) =>
  //   location.pathname.startsWith(route)
  // );

  return (
    // <div className={shouldHaveBlueBackground ? "bg-blue-500" : ""}>
    <div>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/getTopics" element={<Topics />} />
        <Route exact path="/quiz/:topicId" element={<Quiz />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        <Route exact path="/addTopic" element={<AddTopic />} />
        <Route exact path="/addQuestion" element={<AddQuestion />} />
        <Route exact path="/addAdmin" element={<AddAdmin />} />

        <Route exact path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </div>
  );
}

export default App;
