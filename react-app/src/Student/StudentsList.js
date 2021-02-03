import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TablePaginationActions from '../TablePaginationActions.js';
import TablePagination from '@material-ui/core/TablePagination';

import CssBaseline from '@material-ui/core/CssBaseline';
import StudentDataService from "./StudentService";
import DialogComponent from './DialogComponent';
import Navigation from '../Navigation'

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginTop: theme.spacing(8),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    container: {
        maxHeight: 600
    },
    table: {
        minWidth: 650
    },
    btn: {
        marginLeft: '5px'
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
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

export default function StudentsList(props) {
    const theme = useTheme();
    const [alert, setAlert] = useState(false);
    const [alertmsg, setAlertmsg] = useState(null);
    const classes = useStyles();
    const [students, setStudents] = useState([]);
    const [studentid, setStudentid] = useState(null);
    const [opendialogtype, setOpendialogtype] = useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [mounted, setMounted] = useState(true);
    const [opendrawer, setOpendrawer] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [emptyrows, setEmptyrows] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        if (students.length && !alert && !alertmsg) {
            return () => {
                setMounted(false);
            }
        }
        StudentDataService.getAll()
            .then(response => {
                console.log(response.data);
                if (mounted) {
                    setStudents(response.data)
                }
            })
            .catch(e => {
                console.log(e);
            })
        return () => {
            setMounted(false);
        }
    }, [alert, students, alertmsg, mounted]);

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(null);
            }, 5000)
        }
    }, [alert])

    useEffect(() => {
        let emptyRows = rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage)
        setEmptyrows(emptyRows)
    }, [rowsPerPage, students, page]);

    const handleAddStudentDialogOpen = (e) => {
        setStudentid('addStudent')
        setOpendialogtype('addStudent')
    }

    const handleDrawerOpen = () => {
        setOpendrawer(true);
    };

    const handleDrawerClose = () => {
        setOpendrawer(false);
    };

    const handleEditStudentDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.parentElement) {
            let value = e.target.parentElement.parentElement.value || e.target.parentElement.parentElement.parentElement.value
            setStudentid(value)
        }
        setOpendialogtype('editStudent')
    }

    const handleDeleteStudentDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.parentElement) {
            let value = e.target.parentElement.parentElement.value || e.target.parentElement.parentElement.parentElement.value
            setStudentid(value)
        }
        setOpendialogtype('deleteStudent')
    }

    const handleCloseDialog = (e) => {
        setStudentid(null);
        setTimeout(() => {
            setOpendialogtype(null);
        }, 100);
    }

    const handleAddStudent = (student) => {
        StudentDataService.create(student)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    console.log(1, mounted)
                    setStudents([...students, response.data.result])
                    console.log(3, mounted)
                    setAlert('add')
                    setAlertmsg('Student successfully added.')
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
    const handleUpdateStudent = (id, student) =>
        StudentDataService.update(id, student)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    let updatedStudents = students.map(usr => {
                        if (usr._id === response.data.result._id) {
                            return response.data.result
                        }
                        return usr
                    })
                    setStudents(updatedStudents)
                    setAlert('update')
                    setAlertmsg('Student successfully updated.')
                }
            })
            .catch(err => {
                setAlert('error')
                console.log(err.response);
                if (err.response && err.response.data) {
                    setAlertmsg(err.response.data.msg)
                }
            })


    const handleDeleteStudent = (studentid) =>
        StudentDataService.remove(studentid)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    setStudents(students.filter(usr => usr._id !== response.data.result._id))
                    setAlert('delete')
                    setAlertmsg('Student successfully deleted.')
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
        <div className={classes.root}>
            <CssBaseline />
            <Navigation heading="Students" opendrawer={opendrawer} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} handleLogout={props.handleLogout} isAuth={props.isAuth} />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: opendrawer,
                })}
            >
                <Paper className={classes.paper}>
                    <TableContainer className={classes.container} >
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
                                {(rowsPerPage > 0
                                    ? students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : students
                                ).map((row) => (
                                    <TableRow key={row._id}>
                                        <TableCell scope="row" align="center">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        <TableCell align="center">{row.program}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                value={row._id}
                                                onClick={handleEditStudentDialogOpen}
                                                edge="start"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                value={row._id}
                                                onClick={handleDeleteStudentDialogOpen}
                                                edge="start"
                                                className={clsx(classes.btn)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {emptyrows > 0 && (
                                    <TableRow style={{ height: 53 * emptyrows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={3}
                        count={students.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                        }}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </Paper>
            </main>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleAddStudentDialogOpen}>
                <AddIcon />
            </Fab>
            <DialogComponent handleDeleteStudent={handleDeleteStudent} handleUpdateStudent={handleUpdateStudent} opendialogtype={opendialogtype} students={students} studentid={studentid} handleAddStudent={handleAddStudent} fullScreen={fullScreen} handleCloseDialog={handleCloseDialog} />
            <Snackbar open={['add', 'update', 'delete'].includes(alert)} autoHideDuration={5000}>
                <Alert severity="success" variant="filled">{alertmsg}</Alert>
            </Snackbar>
            <Snackbar open={alert === 'error'} autoHideDuration={5000}>
                <Alert severity="error" variant="filled">{alertmsg}</Alert>
            </Snackbar>
        </div>
    );
}
