
import './App.css';
import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './components/Home/Home';
import NFLHome from './components/NFL/NFLHome';
import NBAHome from './components/NBA/NBAHome';
import MLBHome from './components/MLB/MLBHome';
import MLRHome from './components/MLR/MLRHome';
import Nav from './components/Nav/Nav';
import Landing from './components/Landing/Landing';
import Article from './components/Articles/Article';
import ArticlePage from './components/Articles/ArticlePage';
import FantasyPage from './components/Fantasy/FantasyPage';
import HistoryHome from './components/History/HistoryHome';
import PickEmHome from './components/PickEm/PickEmHome';
import PickEmGame from './components/PickEm/PickEmGame';
import {selectUser, login, logout} from './features/userSlice';
import {useSelector, useDispatch} from "react-redux";
import {
  auth,
  onAuthStateChanged
} from './firebase';
import ProfilePage from './components/Profile/ProfilePage';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Footer from './components/Footer/Footer';


function App() {

  const user = useSelector(selectUser);
  const dispatch = useDispatch()

  useEffect(() => {
    onAuthStateChanged(auth, userAuth => { // on any auth state change, do:
      if(userAuth) {
        // user is logged in
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            photoUrl: userAuth.photoURL,
          }))
      } else {
        // user is logged out
        dispatch(logout());
      }
    })
  }, [dispatch])

  const theme = createTheme({
    // https://material.io/resources/color/#!/?view.left=1&view.right=1&secondary.color=05f91b&primary.color=3d5af1
    palette: {
      primary: {
        light: '#cfd8dc',
        main: '#3d5af1',          // G7 main color
        dark: '#FF0000',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#05f91b',          // G7 secondary color
        dark: '#FF0000',
        contrastText: '#000',
      },
      type: 'dark',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="app" id="page-container">
        <Router>
          <Nav />
          <Routes>
            <Route path="/history" element={<HistoryHome />} />
            <Route path="/pickemgame/:slug" element={<PickEmGame />} />
            <Route path="/pickemgame" element={<PickEmGame />} />
            <Route path="/pickem" element={<PickEmHome />} />
            <Route path="/fantasy" element={<FantasyPage />} />
            <Route path="/mlr" element={<MLRHome />} />
            <Route path="/mlb" element={<MLBHome />} />
            <Route path="/nba" element={<NBAHome />} />
            <Route path="/nfl" element={<NFLHome />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/article" element={<Article />} />
            <Route path="/landing" element={<Landing />} />
            <Route exact path="/" element={<Home />} />
          </Routes>
          <Footer />
        </Router>
      </div >
    </ThemeProvider>
  );
}

export default App;
