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

import InstructorDataService from "./InstructorService";
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

export default function InstructorsList() {
    const theme = useTheme();
    const [alert, setAlert] = useState(false);
    const [alertmsg, setAlertmsg] = useState(null);
    const classes = useStyles();
    const [instructors, setInstructors] = useState([]);
    const [instructorid, setInstructorid] = useState(null);
    const [opendialogtype, setOpendialogtype] = React.useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        if (instructors.length && !alert && !alertmsg) {
            return () => {
                setMounted(false);
            }
        }
        InstructorDataService.getAll()
            .then(response => {
                console.log(2, mounted)
                console.log(response.data);
                if (mounted) {
                    setInstructors(response.data)
                }
            })
            .catch(e => {
                console.log(e);
            })
        console.log('inside')
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

    const handleAddInstructorDialogOpen = (e) => {
        setInstructorid('addInstructor')
        setOpendialogtype('addInstructor')
    }

    const handleEditInstructorDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.value) {
            setInstructorid(e.target.parentElement.value)
        }
        setOpendialogtype('editInstructor')
    }

    const handleDeleteInstructorDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.value) {
            setInstructorid(e.target.parentElement.value)
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
                    console.log(1, mounted)
                    setInstructors([...instructors, response.data.result])
                    console.log(3, mounted)
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
                    console.log(1, mounted)
                    let updatedInstructors = instructors.map(inst => {
                        if (inst._id === response.data.result._id) {
                            return response.data.result
                        }
                        return inst
                    })
                    setInstructors(updatedInstructors)
                    console.log(3, mounted)
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
                    console.log(1, mounted)
                    setInstructors(instructors.filter(inst => inst._id !== response.data.result._id))
                    // setInstructors([...instructors, response.data.result])
                    console.log(3, mounted)
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
        <>
            <TableContainer component={Paper} className={classes.container} >
                <Table className={classes.table} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                <Typography variant="h6">First&nbsp;Name</Typography>
                            </TableCell>
                            <TableCell align="center"><Typography variant="h6">Last&nbsp;Name</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Course</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {instructors.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell scope="row" align="center">
                                    {row.firstName}
                                </TableCell>
                                <TableCell align="center">{row.lastName}</TableCell>
                                <TableCell align="center">{row.course}</TableCell>
                                <TableCell align="center">
                                    <Button variant="outlined" color="primary" value={row._id} onClick={handleEditInstructorDialogOpen}>
                                        Edit
                                    </Button>
                                    <Button className={classes.btn} variant="outlined" color="primary" value={row._id} onClick={handleDeleteInstructorDialogOpen}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
        </>
    );
}
