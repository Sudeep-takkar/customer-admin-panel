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
    const [student, setStudent] = useState({
        name: '',
        email: '',
        program: ''
    });

    useEffect(() => {
        if (!props.studentid || props.studentid === 'addStudent') {
            setStudent({
                name: '',
                email: '',
                program: '',
            })
            return
        }
        const student = props.students.find(usr => usr._id === props.studentid)
        setStudent({
            name: student.name,
            email: student.email,
            program: student.program,
        })
    }, [props.students, props.studentid]);

    const handleCloseDialog = () => {
        setStudent({
            name: '',
            email: '',
            program: ''
        });
        props.handleCloseDialog();
    }

    const handleSubmit = () => {
        switch (props.opendialogtype) {
            case 'addStudent':
                props.handleAddStudent(student)
                break;
            case 'editStudent':
                props.handleUpdateStudent(props.studentid, student)
                break;
            case 'deleteStudent':
                props.handleDeleteStudent(props.studentid, student)
                break;
            default:
                break;
        }
    }

    const handleChange = (e) => {
        if (e.target && e.target.id) {
            switch (e.target.id) {
                case 'name':
                    setStudent({ ...student, name: e.target.value })
                    break;
                case 'email':
                    setStudent({ ...student, email: e.target.value })
                    break;
                case 'program':
                    setStudent({ ...student, program: e.target.value })
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
                open={props.studentid ? true : false}
                onClose={props.handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title">{props.opendialogtype === 'addStudent' ? 'Add' : (props.opendialogtype === 'editStudent' ? 'Edit' : 'Delete')} Student</DialogTitle>
                <DialogContent>
                    <Box component="form" flexDirection="column" display="flex" className={classes.form} noValidate autoComplete="off">
                        <TextField
                            required
                            disabled={props.opendialogtype === 'deleteStudent'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteStudent',
                            }}
                            label="Name"
                            id="name"
                            value={student.name}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteStudent'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteStudent',
                            }}
                            label="Email"
                            id="email"
                            onChange={handleChange}
                            value={student.email}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteStudent'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteStudent',
                            }}
                            label="Program"
                            id="program"
                            onChange={handleChange}
                            value={student.program}
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    {props.opendialogtype === 'deleteStudent' && <Button onClick={handleSubmit} color="primary">
                        Delete
                    </Button>}
                    {props.opendialogtype === 'editStudent' && <Button onClick={handleSubmit} color="primary">
                        Update
                    </Button>}
                    {props.opendialogtype === 'addStudent' && <Button onClick={handleSubmit} color="primary">
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
