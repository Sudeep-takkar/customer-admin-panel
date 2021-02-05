import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
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
import CourseDataService from "./CourseService";
import DialogComponent from './DialogComponent';
import Navigation from '../Navigation'

import { StyledTableCell, StyledTableRow } from '../StyledTable'

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
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

export default function CoursesList(props) {
    const theme = useTheme();
    const [alert, setAlert] = useState(false);
    const [alertmsg, setAlertmsg] = useState(null);
    const classes = useStyles();
    const [courses, setCourses] = useState([]);
    const [courseid, setCourseid] = useState(null);
    const [opendialogtype, setOpendialogtype] = useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [mounted, setMounted] = useState(true);
    const [opendrawer, setOpendrawer] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [emptyrows, setEmptyrows] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        if (courses.length && !alert && !alertmsg) {
            return () => {
                setMounted(false);
            }
        }
        CourseDataService.getAll()
            .then(response => {
                // console.log(response.data);
                if (mounted) {
                    setCourses(response.data)
                }
            })
            .catch(e => {
                console.log(e);
            })
        return () => {
            setMounted(false);
        }
    }, [alert, courses, alertmsg, mounted]);

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(null);
            }, 5000)
        }
    }, [alert])

    useEffect(() => {
        let emptyRows = rowsPerPage - Math.min(rowsPerPage, courses.length - page * rowsPerPage)
        setEmptyrows(emptyRows)
    }, [rowsPerPage, courses, page]);

    const handleAddCourseDialogOpen = (e) => {
        setCourseid('addCourse')
        setOpendialogtype('addCourse')
    }

    const handleDrawerOpen = () => {
        setOpendrawer(true);
    };

    const handleDrawerClose = () => {
        setOpendrawer(false);
    };

    const handleEditCourseDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.parentElement) {
            let value = e.target.parentElement.parentElement.value || e.target.parentElement.parentElement.parentElement.value
            setCourseid(value)
        }
        setOpendialogtype('editCourse')
    }

    const handleDeleteCourseDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.parentElement) {
            let value = e.target.parentElement.parentElement.value || e.target.parentElement.parentElement.parentElement.value
            setCourseid(value)
        }
        setOpendialogtype('deleteCourse')
    }

    const handleCloseDialog = (e) => {
        setCourseid(null);
        setTimeout(() => {
            setOpendialogtype(null);
        }, 100);
    }

    const handleAddCourse = (course) => {
        CourseDataService.create(course)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    // console.log(1, mounted)
                    setCourses([...courses, response.data.result])
                    // console.log(3, mounted)
                    setAlert('add')
                    setAlertmsg('Course successfully added.')
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
    const handleUpdateCourse = (id, course) =>
        CourseDataService.update(id, course)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    let updatedCourses = courses.map(usr => {
                        if (usr._id === response.data.result._id) {
                            return response.data.result
                        }
                        return usr
                    })
                    setCourses(updatedCourses)
                    setAlert('update')
                    setAlertmsg('Course successfully updated.')
                }
            })
            .catch(err => {
                setAlert('error')
                console.log(err.response);
                if (err.response && err.response.data) {
                    setAlertmsg(err.response.data.msg)
                }
            })


    const handleDeleteCourse = (courseid) =>
        CourseDataService.remove(courseid)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    setCourses(courses.filter(usr => usr._id !== response.data.result._id))
                    setAlert('delete')
                    setAlertmsg('Course successfully deleted.')
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
            <Navigation heading="Courses" opendrawer={opendrawer} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} handleLogout={props.handleLogout} isAuth={props.isAuth} />
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
                                    <StyledTableCell align="center">
                                        <Typography variant="body1">Title</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Course&nbsp;code</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Program&nbsp;code</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">No&nbsp;of&nbsp;Hours</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">No&nbsp;of&nbsp;Credits</Typography></StyledTableCell>
                                    {/* <StyledTableCell align="center"><Typography variant="body1">Courses&nbsp;Pre-requisites</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Courses&nbsp;Co-requisites</Typography></StyledTableCell> */}
                                    <StyledTableCell align="center"><Typography variant="body1">Actions</Typography></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : courses
                                ).map((row) => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell scope="row" align="center">
                                            {row.title}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.courseCode}</StyledTableCell>
                                        <StyledTableCell align="center">{row.programCode}</StyledTableCell>
                                        <StyledTableCell align="center">{row.hours}</StyledTableCell>
                                        <StyledTableCell align="center">{row.credits}</StyledTableCell>
                                        {/* <StyledTableCell align="center">{row.coursesPreRequisites}</StyledTableCell>
                                        <StyledTableCell align="center">{row.coursesCoRequisites}</StyledTableCell> */}
                                        <StyledTableCell align="center">
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                value={row._id}
                                                onClick={handleEditCourseDialogOpen}
                                                edge="start"
                                                size="small"

                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                value={row._id}
                                                onClick={handleDeleteCourseDialogOpen}
                                                edge="start"
                                                className={clsx(classes.btn)}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
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
                        colSpan={6}
                        count={courses.length}
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
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleAddCourseDialogOpen}>
                <AddIcon />
            </Fab>
            <DialogComponent handleDeleteCourse={handleDeleteCourse} handleUpdateCourse={handleUpdateCourse} opendialogtype={opendialogtype} courses={courses} courseid={courseid} handleAddCourse={handleAddCourse} fullScreen={fullScreen} handleCloseDialog={handleCloseDialog} />
            <Snackbar open={['add', 'update', 'delete'].includes(alert)} autoHideDuration={5000}>
                <Alert severity="success" variant="filled">{alertmsg}</Alert>
            </Snackbar>
            <Snackbar open={alert === 'error'} autoHideDuration={5000}>
                <Alert severity="error" variant="filled">{alertmsg}</Alert>
            </Snackbar>
        </div>
    );
}
