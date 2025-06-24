import { useEffect } from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import Header from './components/header/Header';
import Home from './components/home/Home';
import Layout from './components/Layout';
import Register from './components/register/Register';
import Login from './components/login/Login';
import Recommended from './components/recommended/Recommended';
import Review from './components/review/Review';
import useAuth from './hooks/useAuth';
import axiosClient from './api/axiosConfig';
import RequiredAuth from './components/RequiredAuth';
import StreamMovie from './components/stream/StreamMovie';

function App() {
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();

    useEffect(() => {
    if (auth == null) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setAuth(parsedUser);
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
        }
      }
    }

  }, []);

        const handleLogout = async () => {

        try {
            const response = await axiosClient.post("/logout",{user_id: auth.user_id});
            console.log(response.data);
            setAuth(null);
            localStorage.removeItem('user');
            console.log('User logged out');

        } catch (error) {
            console.error('Error logging out:', error);
        } 

    };

  const updateMovieReview = (imdb_id) => {
      navigate(`/review/${imdb_id}`);
  };

  return (
    <>
      <Header handleLogout = {handleLogout}/>
      <Routes>
          <Route path="/" element={<Layout/>}>
              <Route path="/" element={<Home updateMovieReview={updateMovieReview} />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route element ={<RequiredAuth/>}>
                <Route path="/recommended" element={<Recommended />}></Route>
                <Route path="/review/:imdb_id" element={<Review/>}></Route>
                <Route path="/Stream/:yt_id" element={<StreamMovie/>}></Route>
              </Route>
          </Route>
      </Routes>
    </>
  )
}

export default App
