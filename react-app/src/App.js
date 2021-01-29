import './App.css';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
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
import { useRoutes, navigate } from 'hookrouter';

import Users from './User/UsersList.js'
import Programs from './Program/ProgramsList.js'
import Instructors from './Instructor/InstructorsList.js'

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
}));

const routes = {
  '/': () => <Users />,
  '/students': () => <Users />,
  '/programs': () => <Programs />,
  '/instructors': () => <Instructors />
};

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [componentmounted, setComponentmounted] = useState('');
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (componentmounted) {
      return () => {
        setMounted(false);
      }
    }
    if (mounted) {
      setComponentmounted('Students');
      navigate(`/students`);
    }
    return () => {
      setMounted(false);
    }
  }, [componentmounted, mounted]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // useRedirect('/', '/users')
  // useRedirect('/users', '/programs')
  // useRedirect('/programs', '/instructors')
  // useRedirect('/programs', '/users')
  // useRedirect('/instructors', '/users')
  // useRedirect('/instructors', '/programs')

  const appRoutes = useRoutes(routes)

  const navigateTo = (path) => {
    setComponentmounted(path);
    navigate(`/${path.toLowerCase()}`)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {componentmounted} List
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {/* <A href="/users"> */}
          <ListItem button onClick={() => navigateTo('Students')} selected={componentmounted === 'Students'}>
            <ListItemIcon><PeopleAlt /></ListItemIcon>
            <ListItemText primary={"Students"} />
          </ListItem>
          {/* </A> */}
          {/* <A href="/programs"> */}
          <ListItem button onClick={() => navigateTo('Programs')} selected={componentmounted === 'Programs'}>
            <ListItemIcon><Assignment /></ListItemIcon>
            <ListItemText primary={"Programs"} />
          </ListItem>
          {/* </A> */}
          {/* <A href="/instructors"> */}
          <ListItem button onClick={() => navigateTo('Instructors')} selected={componentmounted === 'Instructors'}>
            <ListItemIcon><PermContactCalendar /></ListItemIcon>
            <ListItemText primary={"Instructors"} />
          </ListItem>
          {/* </A> */}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        {appRoutes}
      </main>
    </div>
  );
}

export default App;
