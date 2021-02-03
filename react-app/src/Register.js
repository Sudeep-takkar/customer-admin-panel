import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import { navigate } from 'hookrouter';
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

export default function Register(props) {
    const classes = useStyles();
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const [redirecttologin, setRedirecttologin] = useState(false);
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const handleChange = e => {
        setUser({ ...user, [e.currentTarget.id]: e.currentTarget.value })
    };

    const handleRegister = (e) => {
        e.preventDefault();
        props.handleRegister(user).then((res) => {
            console.log(res)
            if (res && res.status === 200) {
                setUser({
                    name: '',
                    email: '',
                    password: '',
                    password2: ''
                });
                setTimeout(() => setRedirecttologin(true), 1000)
            }
        })
    }

    const handleRedirectToLogin = () => {
        if (redirecttologin) {
            return <Redirect to='/login' />
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            {handleRedirectToLogin()}
            <div className={classes.paper}>
                <img src={CampusBotLogo} style={{
                    height: '100px',
                    width: '325px'
                }} alt="Logo" />
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        onChange={handleChange}
                        value={user.name}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="Confirm Password"
                        type="password"
                        id="password2"
                        autoComplete="current-password2"
                        value={user.password2}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleRegister}
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item>
                            Already have an account?
                            <Link to="/login">Sign in</Link>
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