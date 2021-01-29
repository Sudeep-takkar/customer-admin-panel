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

import ProgramDataService from "./ProgramService";
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

export default function ProgramsList() {
    const theme = useTheme();
    const [alert, setAlert] = useState(false);
    const [alertmsg, setAlertmsg] = useState(null);
    const classes = useStyles();
    const [programs, setPrograms] = useState([]);
    const [programid, setProgramid] = useState(null);
    const [opendialogtype, setOpendialogtype] = React.useState(null);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        if (programs.length && !alert && !alertmsg) {
            return () => {
                setMounted(false);
            }
        }
        ProgramDataService.getAll()
            .then(response => {
                console.log(2, mounted)
                console.log(response.data);
                if (mounted) {
                    setPrograms(response.data)
                }
            })
            .catch(e => {
                console.log(e);
            })
        console.log('inside')
        return () => {
            setMounted(false);
        }
    }, [alert, programs, alertmsg, mounted]);

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(null);
            }, 5000)
        }
    }, [alert])

    const handleAddProgramDialogOpen = (e) => {
        setProgramid('addProgram')
        setOpendialogtype('addProgram')
    }

    const handleEditProgramDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.value) {
            setProgramid(e.target.parentElement.value)
        }
        setOpendialogtype('editProgram')
    }

    const handleDeleteProgramDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.value) {
            setProgramid(e.target.parentElement.value)
        }
        setOpendialogtype('deleteProgram')
    }

    const handleCloseDialog = (e) => {
        setProgramid(null);
        setTimeout(() => {
            setOpendialogtype(null);
        }, 100);
    }

    const handleAddProgram = (program) => {
        ProgramDataService.create(program)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    console.log(1, mounted)
                    setPrograms([...programs, response.data.result])
                    console.log(3, mounted)
                    setAlert('add')
                    setAlertmsg('Program successfully added.')
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
    const handleUpdateProgram = (id, program) =>
        ProgramDataService.update(id, program)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    console.log(1, mounted)
                    let updatedPrograms = programs.map(pgm => {
                        if (pgm._id === response.data.result._id) {
                            return response.data.result
                        }
                        return pgm
                    })
                    setPrograms(updatedPrograms)
                    console.log(3, mounted)
                    setAlert('update')
                    setAlertmsg('Program successfully updated.')
                }
            })
            .catch(err => {
                setAlert('error')
                console.log(err.response);
                if (err.response && err.response.data) {
                    setAlertmsg(err.response.data.msg)
                }
            })


    const handleDeleteProgram = (programid) =>
        ProgramDataService.remove(programid)
            .then(response => {
                if (response.data && response.data.result) {
                    handleCloseDialog();
                    console.log(1, mounted)
                    setPrograms(programs.filter(pgm => pgm._id !== response.data.result._id))
                    console.log(3, mounted)
                    setAlert('delete')
                    setAlertmsg('Program successfully deleted.')
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
                            <TableCell align="center"><Typography variant="h6">Title</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Duration</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Is&nbsp;Co-op&nbsp;included</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Admissions&nbsp;Link</Typography></TableCell>
                            <TableCell align="center"><Typography variant="h6">Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {programs.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell component="th" scope="row" align="center">
                                    {row.title}
                                </TableCell>
                                <TableCell align="center">{row.duration}</TableCell>
                                <TableCell align="center">{row.isCoop}</TableCell>
                                <TableCell align="center">
                                    <a rel="noopener noreferrer" href={row.admissionsLink} target="_blank">{row.admissionsLink}</a>
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="outlined" color="primary" value={row._id} onClick={handleEditProgramDialogOpen}>
                                        Edit
                                    </Button>
                                    <Button className={classes.btn} variant="outlined" color="primary" value={row._id} onClick={handleDeleteProgramDialogOpen}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleAddProgramDialogOpen}>
                <AddIcon />
            </Fab>
            <DialogComponent handleDeleteProgram={handleDeleteProgram} handleUpdateProgram={handleUpdateProgram} opendialogtype={opendialogtype} programs={programs} programid={programid} handleAddProgram={handleAddProgram} fullScreen={fullScreen} handleCloseDialog={handleCloseDialog} />
            <Snackbar open={['add', 'update', 'delete'].includes(alert)} autoHideDuration={5000}>
                <Alert severity="success" variant="filled">{alertmsg}</Alert>
            </Snackbar>
            <Snackbar open={alert === 'error'} autoHideDuration={5000}>
                <Alert severity="error" variant="filled">{alertmsg}</Alert>
            </Snackbar>
        </>
    );
}
