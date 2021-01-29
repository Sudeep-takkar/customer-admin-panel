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
    const [user, setUser] = useState({
        name: '',
        email: '',
        program: ''
    });

    useEffect(() => {
        if (!props.userid || props.userid === 'addUser') {
            setUser({
                name: '',
                email: '',
                program: '',
            })
            return
        }
        const user = props.users.find(usr => usr._id === props.userid)
        setUser({
            name: user.name,
            email: user.email,
            program: user.program,
        })
    }, [props.users, props.userid]);

    const handleCloseDialog = () => {
        setUser({
            name: '',
            email: '',
            program: ''
        });
        props.handleCloseDialog();
    }

    const handleSubmit = () => {
        switch (props.opendialogtype) {
            case 'addUser':
                props.handleAddUser(user)
                break;
            case 'editUser':
                props.handleUpdateUser(props.userid, user)
                break;
            case 'deleteUser':
                props.handleDeleteUser(props.userid, user)
                break;
            default:
                break;
        }
    }

    const handleChange = (e) => {
        if (e.target && e.target.id) {
            switch (e.target.id) {
                case 'name':
                    setUser({ ...user, name: e.target.value })
                    break;
                case 'email':
                    setUser({ ...user, email: e.target.value })
                    break;
                case 'program':
                    setUser({ ...user, program: e.target.value })
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
                open={props.userid ? true : false}
                onClose={props.handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title">{props.opendialogtype === 'addUser' ? 'Add' : (props.opendialogtype === 'editUser' ? 'Edit' : 'Delete')} Student</DialogTitle>
                <DialogContent>
                    <Box component="form" flexDirection="column" display="flex" className={classes.form} noValidate autoComplete="off">
                        <TextField
                            required
                            disabled={props.opendialogtype === 'deleteUser'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteUser',
                            }}
                            label="Name"
                            id="name"
                            value={user.name}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteUser'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteUser',
                            }}
                            label="Email"
                            id="email"
                            onChange={handleChange}
                            value={user.email}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteUser'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteUser',
                            }}
                            label="Program"
                            id="program"
                            onChange={handleChange}
                            value={user.program}
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    {props.opendialogtype === 'deleteUser' && <Button onClick={handleSubmit} color="primary">
                        Delete
                    </Button>}
                    {props.opendialogtype === 'editUser' && <Button onClick={handleSubmit} color="primary">
                        Update
                    </Button>}
                    {props.opendialogtype === 'addUser' && <Button onClick={handleSubmit} color="primary">
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
