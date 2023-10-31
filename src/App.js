import './App.css';
import About from './components/About';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { Route, Routes } from "react-router-dom"
import MsgState from './context/MsgState';
import Login from './components/Login';
import SearchUser from './components/SearchUser';
import Signup from './components/Signup';

function App() {

  return (
    <>
    <MsgState>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/home' element={<Home />} />
        <Route exact path='/about' element={<About />} />
        <Route exact path='/login' element={<Login/>} />
        <Route exact path='/signup' element={<Signup/>} />
        <Route exact path='/search' element={<SearchUser/>} />
      </Routes>
      </MsgState>
    </>
  );
}

export default App;
