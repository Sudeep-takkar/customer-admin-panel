import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CampusBotLogo from './image(2).png';
import Container from '@material-ui/core/Container';

import {
    Link, Redirect
} from "react-router-dom";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            {'CampusBot '}
            {new Date().getFullYear()}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login(props) {
    const classes = useStyles();
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const handleLogin = (e) => {
        e.preventDefault();
        props.handleLogin(user)
            .then(res => {
                console.log(res)
            })
            .catch(err => {

            })
    }

    const renderRedirectToStudents = () => {

        if (props.isAuth) {
            return <Redirect to='/students' />
        }
    }

    const handleChange = e => {
        setUser({ ...user, [e.currentTarget.id]: e.currentTarget.value })
    };

    return (
        <Container component="main" maxWidth="xs">
            {renderRedirectToStudents()}
            <CssBaseline />
            <div className={classes.paper}>
                {/* <Avatar className={classes.avatar}>
                    <img src={CampusBotLogo} style={{
                        height: '210px',
                        width: '350px'
                    }} alt="Logo" />
                </Avatar> */}
                <img src={CampusBotLogo} style={{
                    height: '100px',
                    width: '325px'
                }} alt="Logo" />
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                        value={user.email}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={user.password}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            Create New Account?
                            <Link to="/register">Sign up</Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}