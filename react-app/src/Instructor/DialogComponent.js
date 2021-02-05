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
        name: '',
        department: '',
        position: '',
        campus: '',
        contact: '',
        extension: '',
        email: ''
    });

    useEffect(() => {
        if (!props.instructorid || props.instructorid === 'addInstructor') {
            setInstructor({
                name: '',
                department: '',
                position: '',
                campus: '',
                contact: '',
                extension: '',
                email: ''
            })
            return
        }
        const instructor = props.instructors.find(usr => usr._id === props.instructorid)
        setInstructor({
            name: instructor.name,
            department: instructor.department,
            position: instructor.position,
            campus: instructor.campus,
            contact: instructor.contact,
            extension: instructor.extension,
            email: instructor.email
        })
    }, [props.instructors, props.instructorid]);

    const handleCloseDialog = () => {
        setInstructor({
            name: '',
            department: '',
            position: '',
            campus: '',
            contact: '',
            extension: '',
            email: ''
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
                case 'name':
                    setInstructor({ ...instructor, name: e.target.value })
                    break;
                case 'department':
                    setInstructor({ ...instructor, department: e.target.value })
                    break;
                case 'email':
                    setInstructor({ ...instructor, email: e.target.value })
                    break;
                case 'position':
                    setInstructor({ ...instructor, position: e.target.value })
                    break;
                case 'campus':
                    setInstructor({ ...instructor, campus: e.target.value })
                    break;
                case 'contact':
                    setInstructor({ ...instructor, contact: e.target.value })
                    break;
                case 'extension':
                    setInstructor({ ...instructor, extension: e.target.value })
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
                            label="Name"
                            id="name"
                            value={instructor.name}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteInstructor'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteInstructor',
                            }}
                            label="Department"
                            id="department"
                            onChange={handleChange}
                            value={instructor.department}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteInstructor'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteInstructor',
                            }}
                            label="Email"
                            id="email"
                            onChange={handleChange}
                            value={instructor.email}
                            variant="outlined"
                        />
                        <TextField
                            required
                            disabled={props.opendialogtype === 'deleteInstructor'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteInstructor',
                            }}
                            label="Designation"
                            id="position"
                            value={instructor.position}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteInstructor'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteInstructor',
                            }}
                            label="Campus"
                            id="campus"
                            onChange={handleChange}
                            value={instructor.campus}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteInstructor'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteInstructor',
                            }}
                            label="Contact"
                            id="contact"
                            onChange={handleChange}
                            value={instructor.contact}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteInstructor'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteInstructor',
                            }}
                            label="Extension"
                            id="extension"
                            onChange={handleChange}
                            value={instructor.extension}
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
