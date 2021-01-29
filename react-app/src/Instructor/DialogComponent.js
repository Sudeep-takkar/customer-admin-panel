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
    const [instructor, setInstructor] = useState({
        firstName: '',
        lastName: '',
        course: ''
    });

    useEffect(() => {
        if (!props.instructorid || props.instructorid === 'addInstructor') {
            setInstructor({
                firstName: '',
                lastName: '',
                course: ''
            })
            return
        }
        const instructor = props.instructors.find(usr => usr._id === props.instructorid)
        setInstructor({
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            course: instructor.course,
        })
    }, [props.instructors, props.instructorid]);

    const handleCloseDialog = () => {
        setInstructor({
            firstName: '',
            lastName: '',
            course: ''
        });
        props.handleCloseDialog();
    }

    const handleSubmit = () => {
        switch (props.opendialogtype) {
            case 'addInstructor':
                props.handleAddInstructor(instructor)
                break;
            case 'editInstructor':
                props.handleUpdateInstructor(props.instructorid, instructor)
                break;
            case 'deleteInstructor':
                props.handleDeleteInstructor(props.instructorid, instructor)
                break;
            default:
                break;
        }
    }

    const handleChange = (e) => {
        if (e.target && e.target.id) {
            switch (e.target.id) {
                case 'firstName':
                    setInstructor({ ...instructor, firstName: e.target.value })
                    break;
                case 'lastName':
                    setInstructor({ ...instructor, lastName: e.target.value })
                    break;
                case 'course':
                    setInstructor({ ...instructor, course: e.target.value })
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
                open={props.instructorid ? true : false}
                onClose={props.handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title">{props.opendialogtype === 'addInstructor' ? 'Add' : (props.opendialogtype === 'editInstructor' ? 'Edit' : 'Delete')} Instructor</DialogTitle>
                <DialogContent>
                    <Box component="form" flexDirection="column" display="flex" className={classes.form} noValidate autoComplete="off">
                        <TextField
                            required
                            disabled={props.opendialogtype === 'deleteInstructor'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteInstructor',
                            }}
                            label="First Name"
                            id="firstName"
                            value={instructor.firstName}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteInstructor'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteInstructor',
                            }}
                            label="Last Email"
                            id="lastName"
                            onChange={handleChange}
                            value={instructor.lastName}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteInstructor'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteInstructor',
                            }}
                            label="Course"
                            id="course"
                            onChange={handleChange}
                            value={instructor.course}
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    {props.opendialogtype === 'deleteInstructor' && <Button onClick={handleSubmit} color="primary">
                        Delete
                    </Button>}
                    {props.opendialogtype === 'editInstructor' && <Button onClick={handleSubmit} color="primary">
                        Update
                    </Button>}
                    {props.opendialogtype === 'addInstructor' && <Button onClick={handleSubmit} color="primary">
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
