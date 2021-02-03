import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import Assignment from '@material-ui/icons/Assignment';
import PermContactCalendar from '@material-ui/icons/PermContactCalendar';
import ExitToApp from '@material-ui/icons/ExitToApp';

import CampusBotLogo from './image(2).png';

import { Link } from 'react-router-dom'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    left: {
        display: 'flex',
        alignItems: 'center'
    }
}));

export default function Navigation(props) {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: props.opendrawer,
                })}
            >
                <Toolbar className={classes.toolbar}>
                    <div className={classes.left}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={props.handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, props.opendrawer && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            {props.heading} List
                    </Typography>
                    </div>
                    <IconButton
                        color="inherit"
                        aria-label="logout"
                        onClick={props.handleLogout}
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={props.opendrawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <img src={CampusBotLogo} style={{
                        height: '65px',
                        width: '195px'
                    }} alt="Logo" />
                    <IconButton onClick={props.handleDrawerClose} style={{ width: '30px' }}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Link to="/students">
                        <ListItem button selected={props.heading === 'Students'}>
                            <ListItemIcon><PeopleAlt /></ListItemIcon>
                            <ListItemText primary={"Students"} />
                        </ListItem>
                    </Link>
                    <Link to="/programs">
                        <ListItem button selected={props.heading === 'Programs'}>
                            <ListItemIcon><Assignment /></ListItemIcon>
                            <ListItemText primary={"Programs"} />
                        </ListItem>
                    </Link>
                    <Link to="/instructors">
                        <ListItem button selected={props.heading === 'Instructors'}>
                            <ListItemIcon><PermContactCalendar /></ListItemIcon>
                            <ListItemText primary={"Instructors"} />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        </>
    );
}
