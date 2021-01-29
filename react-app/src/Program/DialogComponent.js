import React, { useState, useEffect } from 'react';
import { Button, Dialog, TextField, DialogActions, DialogContent, DialogTitle, useMediaQuery, Box } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    form: {
        '& > *': {
            margin: theme.spacing(2),
        },
    },
}));

export default function DialogComponent(props) {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [program, setProgram] = useState({
        title: '',
        duration: '',
        isCoop: '',
        admissionsLink: ''
    });

    useEffect(() => {
        if (!props.programid || props.programid === 'addProgram') {
            setProgram({
                title: '',
                duration: '',
                isCoop: '',
                admissionsLink: ''
            })
            return
        }
        const program = props.programs.find(pgm => pgm._id === props.programid)
        setProgram({
            title: program.title,
            duration: program.duration,
            isCoop: program.isCoop,
            admissionsLink: program.admissionsLink,
        })
    }, [props.programs, props.programid]);

    const handleCloseDialog = () => {
        setProgram({
            title: '',
            duration: '',
            isCoop: '',
            admissionsLink: ''
        });
        props.handleCloseDialog();
    }

    const handleSubmit = () => {
        switch (props.opendialogtype) {
            case 'addProgram':
                props.handleAddProgram(program)
                break;
            case 'editProgram':
                props.handleUpdateProgram(props.programid, program)
                break;
            case 'deleteProgram':
                props.handleDeleteProgram(props.programid, program)
                break;
            default:
                break;
        }
    }

    const handleChange = (e) => {
        if (e.target && e.target.id) {
            switch (e.target.id) {
                case 'title':
                    setProgram({ ...program, title: e.target.value })
                    break;
                case 'duration':
                    setProgram({ ...program, duration: e.target.value })
                    break;
                case 'isCoop':
                    setProgram({ ...program, isCoop: e.target.value })
                    break;
                case 'admissionsLink':
                    setProgram({ ...program, admissionsLink: e.target.value })
                    break;
                default:
                    break;
            }
        }
    }

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={props.programid ? true : false}
                onClose={props.handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title">{props.opendialogtype === 'addProgram' ? 'Add' : (props.opendialogtype === 'editProgram' ? 'Edit' : 'Delete')} Program</DialogTitle>
                <DialogContent>
                    <Box component="form" flexDirection="column" display="flex" className={classes.form} noValidate autoComplete="off">
                        <TextField
                            required
                            disabled={props.opendialogtype === 'deleteProgram'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteProgram',
                            }}
                            label="Title"
                            id="title"
                            value={program.title}
                            onChange={handleChange}
                            variant="outlined"

                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteProgram'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteProgram',
                            }}
                            label="Duration"
                            id="duration"
                            onChange={handleChange}
                            value={program.duration}
                            variant="outlined"

                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteProgram'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteProgram',
                            }}
                            label="Is Co-op included"
                            id="isCoop"
                            onChange={handleChange}
                            value={program.isCoop}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteProgram'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteProgram',
                            }}
                            label="Admissions Link"
                            id="admissionsLink"
                            onChange={handleChange}
                            value={program.admissionsLink}
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    {props.opendialogtype === 'deleteProgram' && <Button onClick={handleSubmit} color="primary">
                        Delete
                    </Button>}
                    {props.opendialogtype === 'editProgram' && <Button onClick={handleSubmit} color="primary">
                        Update
                    </Button>}
                    {props.opendialogtype === 'addProgram' && <Button onClick={handleSubmit} color="primary">
                        Add
                    </Button>}
                    <Button autoFocus onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
