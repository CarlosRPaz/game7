
import './App.css';
import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './components/Home/Home';
import NFLHome from './components/NFL/NFLHome';
import NBAHome from './components/NBA/NBAHome';
import MLBHome from './components/MLB/MLBHome';
import MLRHome from './components/MLR/MLRHome';
import Nav from './components/Nav/Nav';
import Article from './components/Articles/Article';
import ArticlePage from './components/Articles/ArticlePage';
import { selectUser, login, logout } from './features/userSlice';
import { useSelector, useDispatch } from "react-redux";
import { auth } from './firebase';
import Login from './components/Auth/Login';
import ProfilePage from './components/Profile/ProfilePage';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import Footer from './components/Footer/Footer';


function App() {

  const user = useSelector(selectUser);
  const dispatch = useDispatch()

  useEffect(() => {
    auth.onAuthStateChanged(userAuth => { // on any auth state change, do:
      if (userAuth) {
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
  }, [])

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
      <div className="app">
        <Router>
          <Nav />
          <Switch>
            <Route path="/mlr">
              <MLRHome />
            </Route>
            <Route path="/mlb">
              <MLBHome />
            </Route>
            <Route path="/nba">
              <NBAHome />
            </Route>
            <Route path="/nfl">
              <NFLHome />
            </Route>
            <Route path="/profile/:uid">
              <ProfilePage />
            </Route>
            <Route path="/profile">
              <ProfilePage />
            </Route>
            <Route path="/article/:slug">
              <ArticlePage />
            </Route>
            <Route path="/article">
              <Article />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </div >
    </ThemeProvider>
  );
}

export default App;
