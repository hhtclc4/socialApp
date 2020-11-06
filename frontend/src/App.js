import React from 'react'
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home/Home';
// import Register from './pages/Register'
import Login from './pages/Login';
import { AuthProvider } from './context/AuthUser'
import PageShow from './pages/PageShow/PageShow.js'
import Nav from './components/Nav/Nav'
import Profile from './pages/Profile/Profile'
// import { AuthUser } from './context/AuthUser'
// import AuthRoute from './util/AuthRoute'
function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <PageShow />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
