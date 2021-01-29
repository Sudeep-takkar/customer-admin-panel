import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';

import UserDataService from "./UserService";
import DialogComponent from './DialogComponent';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(8)
    },
    table: {
        minWidth: 650
    },
    btn: {
        marginLeft: '5px'
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

export default function UsersList() {
    const theme = useTheme();
    const [alert, setAlert] = useState(false);
    const [alertmsg, setAlertmsg] = useState(null);
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [userid, setUserid] = useState(null);
    const [opendialogtype, setOpendialogtype] = React.useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        if (users.length && !alert && !alertmsg) {
            return () => {
                setMounted(false);
            }
        }
        UserDataService.getAll()
            .then(response => {
                console.log(response.data);
                if (mounted) {
                    setUsers(response.data)
                }
            })
            .catch(e => {
                console.log(e);
            })
        return () => {
            setMounted(false);
        }
    }, [alert, users, alertmsg, mounted]);

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(null);
            }, 5000)
        }
    }, [alert])

    const handleAddUserDialogOpen = (e) => {
        setUserid('addUser')
        setOpendialogtype('addUser')
    }

    const handleEditUserDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.value) {
            setUserid(e.target.parentElement.value)
        }
        setOpendialogtype('editUser')
    }

    const handleDeleteUserDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.value) {
            setUserid(e.target.parentElement.value)
        }
        setOpendialogtype('deleteUser')
    }

    const handleCloseDialog = (e) => {
        setUserid(null);
        setTimeout(() => {
            setOpendialogtype(null);
        }, 100);
    }

    const handleAddUser = (user) => {
        UserDataService.create(user)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    console.log(1, mounted)
                    setUsers([...users, response.data.result])
                    console.log(3, mounted)
                    setAlert('add')
                    setAlertmsg('User successfully added.')
                }
            })
            .catch(err => {
                setAlert('error')
                console.log(err.response);
                if (err.response && err.response.data) {
                    setAlertmsg(err.response.data.msg)
                }
            })
    }
    const handleUpdateUser = (id, user) =>
        UserDataService.update(id, user)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    let updatedUsers = users.map(usr => {
                        if (usr._id === response.data.result._id) {
                            return response.data.result
                        }
                        return usr
                    })
                    setUsers(updatedUsers)
                    setAlert('update')
                    setAlertmsg('User successfully updated.')
                }
            })
            .catch(err => {
                setAlert('error')
                console.log(err.response);
                if (err.response && err.response.data) {
                    setAlertmsg(err.response.data.msg)
                }
            })


    const handleDeleteUser = (userid) =>
        UserDataService.remove(userid)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    setUsers(users.filter(usr => usr._id !== response.data.result._id))
                    setAlert('delete')
                    setAlertmsg('User successfully deleted.')
                }
            })
            .catch(err => {
                setAlert('error')
                console.log(err.response);
                if (err.response && err.response.data) {
                    setAlertmsg(err.response.data.msg)
                }
            })
    return (
        <>
            <TableContainer component={Paper} className={classes.container} >
                <Table className={classes.table} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <Typography variant="h6">Name</Typography>
                            </TableCell>
                            <TableCell align="center"><Typography variant="h6">Email</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Program</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell scope="row" align="center">
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">{row.email}</TableCell>
                                <TableCell align="center">{row.program}</TableCell>
                                <TableCell align="center">
                                    <Button variant="outlined" color="primary" value={row._id} onClick={handleEditUserDialogOpen}>
                                        Edit
                                    </Button>
                                    <Button className={classes.btn} variant="outlined" color="primary" value={row._id} onClick={handleDeleteUserDialogOpen}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleAddUserDialogOpen}>
                <AddIcon />
            </Fab>
            <DialogComponent handleDeleteUser={handleDeleteUser} handleUpdateUser={handleUpdateUser} opendialogtype={opendialogtype} users={users} userid={userid} handleAddUser={handleAddUser} fullScreen={fullScreen} handleCloseDialog={handleCloseDialog} />
            <Snackbar open={['add', 'update', 'delete'].includes(alert)} autoHideDuration={5000}>
                <Alert severity="success" variant="filled">{alertmsg}</Alert>
            </Snackbar>
            <Snackbar open={alert === 'error'} autoHideDuration={5000}>
                <Alert severity="error" variant="filled">{alertmsg}</Alert>
            </Snackbar>
        </>
    );
}
