import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
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

import ProgramDataService from "./ProgramService";
import CssBaseline from '@material-ui/core/CssBaseline';
import Navigation from '../Navigation'
import DialogComponent from './DialogComponent';
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
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

export default function ProgramsList(props) {
    const theme = useTheme();
    const [alert, setAlert] = useState(false);
    const [alertmsg, setAlertmsg] = useState(null);
    const classes = useStyles();
    const [programs, setPrograms] = useState([]);
    const [programid, setProgramid] = useState(null);
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
        let emptyRows = rowsPerPage - Math.min(rowsPerPage, programs.length - page * rowsPerPage)
        setEmptyrows(emptyRows)
    }, [rowsPerPage, programs, page]);

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
        if (e.target && e.target.parentElement && e.target.parentElement.parentElement) {
            let value = e.target.parentElement.parentElement.value || e.target.parentElement.parentElement.parentElement.value
            setProgramid(value)
        }
        setOpendialogtype('editProgram')
    }

    const handleDeleteProgramDialogOpen = (e) => {
        if (e.target && e.target.parentElement && e.target.parentElement.parentElement) {
            let value = e.target.parentElement.parentElement.value || e.target.parentElement.parentElement.parentElement.value
            setProgramid(value)
        }
        setOpendialogtype('deleteProgram')
    }

    const handleDrawerOpen = () => {
        setOpendrawer(true);
    };

    const handleDrawerClose = () => {
        setOpendrawer(false);
    };

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
        <div className={classes.root}>
            <CssBaseline />
            <Navigation heading="Programs" opendrawer={opendrawer} handleDrawerClose={handleDrawerClose} handleDrawerOpen={handleDrawerOpen} isAuth={props.isAuth} handleLogout={props.handleLogout} />
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
                                    <StyledTableCell align="center"><Typography variant="body1">Title</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Program&nbsp;code</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Length</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Delivery&nbsp;type</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Start&nbsp;date</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Campus</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Credentials</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Is&nbsp;Co-op&nbsp;included</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Admissions&nbsp;Link</Typography></StyledTableCell>
                                    <StyledTableCell align="center"><Typography variant="body1">Actions</Typography></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? programs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : programs
                                ).map((row) => (
                                    <StyledTableRow key={row._id}>
                                        <StyledTableCell component="th" scope="row" align="center">
                                            {row.title}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{row.programCode}</StyledTableCell>
                                        <StyledTableCell align="center">{row.duration}</StyledTableCell>
                                        <StyledTableCell align="center">{row.deliveryType}</StyledTableCell>
                                        <StyledTableCell align="center">{row.programStartDate}</StyledTableCell>
                                        <StyledTableCell align="center">{row.campus}</StyledTableCell>
                                        <StyledTableCell align="center">{row.credentials}</StyledTableCell>
                                        <StyledTableCell align="center">{row.isCoop}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <a rel="noopener noreferrer" href={row.admissionsLink} target="_blank">{row.admissionsLink}</a>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                value={row._id}
                                                onClick={handleEditProgramDialogOpen}
                                                edge="start"
                                                className={clsx(classes.menuButton)}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                value={row._id}
                                                onClick={handleDeleteProgramDialogOpen}
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
                                        <TableCell colSpan={5} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={3}
                        count={programs.length}
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
        </div>
    );
}
