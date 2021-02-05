import './App.css';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";

import Students from '../Student/StudentsList.js'
import Courses from '../Course/CoursesList.js'
import Programs from '../Program/ProgramsList.js'
import Instructors from '../Instructor/InstructorsList.js'
import Login from '../Login.js'
import Register from '../Register.js'
import AppServices from './AppServices.js'
import ProtectedRoute from './ProtectedRoute.js'
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

function App() {
  const [isAuth, setIsauth] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertmsg, setAlertmsg] = useState(null);
  useEffect(() => {
    let authValue = localStorage.getItem('auth')
    if (!isAuth && authValue == 'true') {
      setIsauth(true)
    }
  }, [isAuth]);

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 5000)
    }
  }, [alert])

  const handleLogin = (data) => {
    return AppServices.login(data)
      .then(response => {
        console.log('login response', response);
        localStorage.setItem('auth', true);
        setIsauth(true)
        return response
      })
      .catch(err => {
        setAlert('error')
        console.log(err.response);
        if (err.response && err.response.data) {
          if (err.response.data.email) {
            setAlertmsg(err.response.data.email)
          }
          else if (err.response.data.password) {
            setAlertmsg(err.response.data.password)
          }
          else if (err.response.data.passwordincorrect) {
            setAlertmsg(err.response.data.passwordincorrect)
          }
        }
      })
  }

  const handleLogout = () => {
    localStorage.setItem('auth', false)
    setIsauth(false)
  }

  const handleRegister = (data) => {
    return AppServices.register(data)
      .then(response => {
        console.log('login response', response);
        setAlert('register');
        setAlertmsg('User registered successfully!')
        return response
      })
      .catch(err => {
        setAlert('error')
        console.log(err.response);
        if (err.response && err.response.data) {
          if (err.response.data.email) {
            setAlertmsg(err.response.data.email)
          }
          else if (err.response.data.password) {
            setAlertmsg(err.response.data.password)
          }
          else if (err.response.data.password2) {
            setAlertmsg(err.response.data.password2)
          }
        }
      })
  }
  return (
    <>
      <BrowserRouter>
        <Switch>
          {/* {renderRedirectToLogin()} */}
          <Route exact path="/">
            {!isAuth ? <Login handleLogin={handleLogin} handleLogout={handleLogout} isAuth={isAuth} /> : <Redirect to="/students" />}
          </Route>
          <Route path="/login">
            {!isAuth ? <Login handleLogin={handleLogin} handleLogout={handleLogout} isAuth={isAuth} /> : <Redirect to="/students" />}
          </Route>
          <Route path="/register">
            {!isAuth ? <Register handleRegister={handleRegister} isAuth={isAuth} /> : <Redirect to="/students" />}
          </Route>
          <ProtectedRoute exact={true} path="/students" component={Students} handleLogout={handleLogout} isAuth={isAuth} />
          <ProtectedRoute exact={true} path="/instructors" component={Instructors} handleLogout={handleLogout} isAuth={isAuth} />
          <ProtectedRoute exact={true} path="/programs" component={Programs} handleLogout={handleLogout} isAuth={isAuth} />
          <ProtectedRoute exact={true} path="/courses" component={Courses} handleLogout={handleLogout} isAuth={isAuth} />
        </Switch>
      </BrowserRouter>
      <Snackbar open={['register'].includes(alert)} autoHideDuration={5000}>
        <Alert severity="success" variant="filled">{alertmsg}</Alert>
      </Snackbar>
      <Snackbar open={alert === 'error'} autoHideDuration={5000}>
        <Alert severity="error" variant="filled">{alertmsg}</Alert>
      </Snackbar>
    </>
  );
}

export default App;
