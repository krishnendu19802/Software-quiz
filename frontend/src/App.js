import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Topics from './Components/Topics/Topics';
import AddTopic from './Components/addTopic/AddTopic';
import AddQuestion from './Components/AddQuestion/AddQuestion';
import AddAdmin from './Components/AddAdmin/AddAdmin';
import Quiz from './Components/Quiz/Quiz';
import ProfilePage from './Components/ProfilePage/ProfilePage';

function App() {
  return (
    <div className="bg-blue-500">
      <BrowserRouter>
      <Routes>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/register' element={<Register/>}/>
        <Route exact path='/getTopics' element={<Topics/>}/>
        <Route exact path='/quiz/:topicId' element={<Quiz/>}/>
        <Route exact path='/profile' element={<ProfilePage/>}/>


        <Route exact path='/addTopic' element={<AddTopic/>}/>
        <Route exact path='/addQuestion' element={<AddQuestion/>}/>
        <Route exact path='/addAdmin' element={<AddAdmin/>}/>






      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
