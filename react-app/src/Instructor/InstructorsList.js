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

import InstructorDataService from "./InstructorService";
import DialogComponent from './DialogComponent';
import Navigation from '../Navigation'
import { StyledTableCell, StyledTableRow } from '../StyledTable'

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    container: {
        maxHeight: 600
    },
    table: {
        minWidth: 650
    },
    paper: {
        marginTop: theme.spacing(8),
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
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

export default function InstructorsList(props) {
    const theme = useTheme();
    const [alert, setAlert] = useState(false);
    const [alertmsg, setAlertmsg] = useState(null);
    const classes = useStyles();
    const [instructors, setInstructors] = useState([]);
    const [instructorid, setInstructorid] = useState(null);
    const [opendialogtype, setOpendialogtype] = React.useState(null);
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
        let emptyRows = rowsPerPage - Math.min(rowsPerPage, instructors.length - page * rowsPerPage)
        setEmptyrows(emptyRows)
    }, [rowsPerPage, instructors, page]);

    useEffect(() => {
        if (instructors.length && !alert && !alertmsg) {
            return () => {
                setMounted(false);
            }
        }
        InstructorDataService.getAll()
            .then(response => {
                // console.log(2, mounted)
                // console.log(response.data);
                if (mounted) {
                    setInstructors(response.data)
                }
            })
            .catch(e => {
                console.log(e);
            })
        return () => {
            setMounted(false);
        }
    }, [alert, instructors, alertmsg, mounted]);

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(null);
            }, 5000)
        }
    }, [alert])

    const handleDrawerOpen = () => {
        setOpendrawer(true);
    };

    const handleDrawerClose = () => {
        setOpendrawer(false);
    };

    const handleAddInstructorDialogOpen = (e) => {
        setInstructorid('addInstructor')
        setOpendialogtype('addInstructor')
    }

    const handleEditInstructorDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.parentElement) {
            let value = e.target.parentElement.parentElement.value || e.target.parentElement.parentElement.parentElement.value
            setInstructorid(value)
        }
        setOpendialogtype('editInstructor')
    }

    const handleDeleteInstructorDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.parentElement) {
            let value = e.target.parentElement.parentElement.value || e.target.parentElement.parentElement.parentElement.value
            setInstructorid(value)
        }
        setOpendialogtype('deleteInstructor')
    }

    const handleCloseDialog = (e) => {
        setInstructorid(null);
        setTimeout(() => {
            setOpendialogtype(null);
        }, 100);
    }

    const handleAddInstructor = (instructor) => {
        InstructorDataService.create(instructor)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    // console.log(1, mounted)
                    setInstructors([...instructors, response.data.result])
                    // console.log(3, mounted)
                    setAlert('add')
                    setAlertmsg('Instructor successfully added.')
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
    const handleUpdateInstructor = (id, instructor) =>
        InstructorDataService.update(id, instructor)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    // console.log(1, mounted)
                    let updatedInstructors = instructors.map(inst => {
                        if (inst._id === response.data.result._id) {
                            return response.data.result
                        }
                        return inst
                    })
                    setInstructors(updatedInstructors)
                    // console.log(3, mounted)
                    setAlert('update')
                    setAlertmsg('Instructor successfully updated.')
                }
            })
            .catch(err => {
                setAlert('error')
                console.log(err.response);
                if (err.response && err.response.data) {
                    setAlertmsg(err.response.data.msg)
                }
            })


    const handleDeleteInstructor = (instructorid) =>
        InstructorDataService.remove(instructorid)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    // console.log(1, mounted)
                    setInstructors(instructors.filter(inst => inst._id !== response.data.result._id))
                    // setInstructors([...instructors, response.data.result])
                    // console.log(3, mounted)
                    setAlert('delete')
                    setAlertmsg('Instructor successfully deleted.')
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
            <Navigation heading="Instructors" opendrawer={opendrawer} handleDrawerClose={handleDrawerClose} isAuth={props.isAuth} handleLogout={props.handleLogout} handleDrawerOpen={handleDrawerOpen} />
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
                                        <Typography variant="body1">Name</Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Department</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Email</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Designation</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Campus</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Contact</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Extension</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Actions</Typography></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? instructors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : instructors
                                ).map((row) => (
                                    <StyledTableRow key={row._id}>
                                        {/* // name	department email	position	campus	contact	extension	 */}
                                        <StyledTableCell scope="row" align="center">
                                            {row.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.department}</StyledTableCell>
                                        <StyledTableCell align="center">{row.email}</StyledTableCell>
                                        <StyledTableCell align="center">{row.position}</StyledTableCell>
                                        <StyledTableCell align="center">{row.campus}</StyledTableCell>
                                        <StyledTableCell align="center">{row.contact}</StyledTableCell>
                                        <StyledTableCell align="center">{row.extension}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                value={row._id}
                                                onClick={handleEditInstructorDialogOpen}
                                                edge="start"
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                value={row._id}
                                                onClick={handleDeleteInstructorDialogOpen}
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
                                        <TableCell colSpan={8} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={8}
                        count={instructors.length}
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
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleAddInstructorDialogOpen}>
                <AddIcon />
            </Fab>
            <DialogComponent handleDeleteInstructor={handleDeleteInstructor} handleUpdateInstructor={handleUpdateInstructor} opendialogtype={opendialogtype} instructors={instructors} instructorid={instructorid} handleAddInstructor={handleAddInstructor} fullScreen={fullScreen} handleCloseDialog={handleCloseDialog} />
            <Snackbar open={['add', 'update', 'delete'].includes(alert)} autoHideDuration={5000}>
                <Alert severity="success" variant="filled">{alertmsg}</Alert>
            </Snackbar>
            <Snackbar open={alert === 'error'} autoHideDuration={5000}>
                <Alert severity="error" variant="filled">{alertmsg}</Alert>
            </Snackbar>
        </div>
    );
}
