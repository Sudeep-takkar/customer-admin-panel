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
    const [course, setCourse] = useState({
        title: '',
        courseCode: '',
        programCode: '',
        hours: '',
        credits: '',
        coursesPreRequisites: '',
        coursesCoRequisites: ''
    });

    useEffect(() => {
        if (!props.courseid || props.courseid === 'addCourse') {
            setCourse({
                title: '',
                courseCode: '',
                programCode: '',
                hours: '',
                credits: '',
                coursesPreRequisites: '',
                coursesCoRequisites: ''
            })
            return
        }
        const course = props.courses.find(usr => usr._id === props.courseid)
        setCourse({
            title: course.title,
            courseCode: course.courseCode,
            programCode: course.programCode,
            hours: course.hours,
            credits: course.credits,
            coursesPreRequisites: course.coursesPreRequisites,
            coursesCoRequisites: course.coursesCoRequisites
        })
    }, [props.courses, props.courseid]);

    const handleCloseDialog = () => {
        setCourse({
            title: '',
            courseCode: '',
            programCode: '',
            hours: '',
            credits: '',
            coursesPreRequisites: '',
            coursesCoRequisites: ''
        });
        props.handleCloseDialog();
    }

    const handleSubmit = () => {
        switch (props.opendialogtype) {
            case 'addCourse':
                props.handleAddCourse(course)
                break;
            case 'editCourse':
                props.handleUpdateCourse(props.courseid, course)
                break;
            case 'deleteCourse':
                props.handleDeleteCourse(props.courseid, course)
                break;
            default:
                break;
        }
    }

    const handleChange = (e) => {
        if (e.target && e.target.id) {
            switch (e.target.id) {
                case 'title':
                    setCourse({ ...course, title: e.target.value })
                    break;
                case 'courseCode':
                    setCourse({ ...course, courseCode: e.target.value })
                    break;
                case 'programCode':
                    setCourse({ ...course, programCode: e.target.value })
                    break;
                case 'hours':
                    setCourse({ ...course, hours: e.target.value })
                    break;
                case 'credits':
                    setCourse({ ...course, credits: e.target.value })
                    break;
                case 'coursesPreRequisites':
                    setCourse({ ...course, coursesPreRequisites: e.target.value })
                    break;
                case 'coursesCoRequisites':
                    setCourse({ ...course, coursesCoRequisites: e.target.value })
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
                open={props.courseid ? true : false}
                onClose={props.handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title">{props.opendialogtype === 'addCourse' ? 'Add' : (props.opendialogtype === 'editCourse' ? 'Edit' : 'Delete')} Course</DialogTitle>
                <DialogContent>
                    <Box component="form" flexDirection="column" display="flex" className={classes.form} noValidate autoComplete="off">
                        <TextField
                            required
                            disabled={props.opendialogtype === 'deleteCourse'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteCourse',
                            }}
                            label="Title"
                            id="title"
                            value={course.title}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteCourse'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteCourse',
                            }}
                            label="Course Code"
                            id="courseCode"
                            onChange={handleChange}
                            value={course.courseCode}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteCourse'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteCourse',
                            }}
                            label="Program code"
                            id="programCode"
                            onChange={handleChange}
                            value={course.programCode}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteCourse'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteCourse',
                            }}
                            label="No of Hours"
                            id="hours"
                            onChange={handleChange}
                            value={course.hours}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteCourse'}
                            required
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteCourse',
                            }}
                            label="No of Credits"
                            id="credits"
                            onChange={handleChange}
                            value={course.credits}
                            variant="outlined"
                        />
                        {/* <TextField
                            disabled={props.opendialogtype === 'deleteCourse'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteCourse',
                            }}
                            label="Courses pre-requisites"
                            id="coursesPreRequisites"
                            onChange={handleChange}
                            value={course.coursesPreRequisites}
                            variant="outlined"
                        />
                        <TextField
                            disabled={props.opendialogtype === 'deleteCourse'}
                            inputProps={{
                                readOnly: props.opendialogtype === 'deleteCourse',
                            }}
                            label="Courses co-requisites"
                            id="coursesCoRequisites"
                            onChange={handleChange}
                            value={course.coursesCoRequisites}
                            variant="outlined"
                        /> */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    {props.opendialogtype === 'deleteCourse' && <Button onClick={handleSubmit} color="primary">
                        Delete
                    </Button>}
                    {props.opendialogtype === 'editCourse' && <Button onClick={handleSubmit} color="primary">
                        Update
                    </Button>}
                    {props.opendialogtype === 'addCourse' && <Button onClick={handleSubmit} color="primary">
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
