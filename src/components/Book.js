import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import 'moment-timezone';
import _ from 'underscore'
import '../css/myCss.css';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import history from './history';

let data1;

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

const getSlotByDdmmyyyy = (ddmmyyyy, state) => {
    let slots = [];
    const { bookingsbydate } = state?.doctorsbookings[0];

    bookingsbydate?.map((booking) => {
        if (booking?.date === ddmmyyyy) {
            booking?.bookings?.map((slotbookings) => {
                slots = [...slots, slotbookings?.slot];
            })
        }
    });

    const { time } = state;
    /*
     USE LODASH LIB TO FIND THE DIFFERENCE.
     */
    let availableSlots = _.difference(time, slots);

    return { availableSlots };
}

function Book(props) {
    const classes = useStyles();
    let dt = new Date();
    let todayDate = dt.getFullYear() + "-" + ((dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : "0" + (dt.getMonth() + 1)) + "-" + (dt.getDate() < 10 ? ("0" + dt.getDate()) : dt.getDate());
    const [selectedDate, setSelectedDate] = useState(todayDate)
    let { id } = useParams();
    id = parseInt(id);
    const dispatch = useDispatch();
    const state = useSelector(state => state.data);
    const userId = parseInt(state?.loggedInUser?.user?.id);

    useEffect(() => {
        const doctorsBookings = async () => {
            const response = await api.get('/doctorsbookings', {
                params: {
                    docid: `${id}`
                }
            });
            dispatch({ type: "DOCTORS_BOOKINGS", payload: response?.data[0] });
            const docId = parseInt(id);
            const myDoc = state?.myDoctors?.doctors?.filter((doc) => doc?.id === docId)
            dispatch({ type: "SELECTED_DOCTOR", payload: myDoc[0] });
        }
        doctorsBookings();

    }, [selectedDate]);

    const handleChange = (event) => {
        setSelectedDate(event?.target?.value);
        getDoctorsData(event?.target?.value);
    }

    const getDoctorsData = (today) => {
        data1 = getSlotByDdmmyyyy(today, state)
    }
    const bookSlotByDate = (time) => {
        let doesBookingExist = false;
        console.log("state = " + JSON.stringify(state));
        if (state?.loggedInUser?.user != null) {
            const bookingsbydate = state?.doctorsbookings[0].bookingsbydate;

            bookingsbydate?.map((booking) => {
                if (booking?.date === selectedDate) {
                    doesBookingExist = true;
                    booking?.bookings?.push({ "userId": state?.loggedInUser?.user?.id, "slot": time });

                    let obj = { "docid": id, "bookingsbydate": bookingsbydate };
                    const patchDoctorsBookings1 = async () => {
                        let response2 = await api.patch(`/doctorsbookings/${id}`, obj);
                    }
                    patchDoctorsBookings1();
                    console.log("state = " + JSON.stringify(state));
                }
            });
            if (!doesBookingExist) {
                let bookings = [];
                bookings.push({ "userId": state?.loggedInUser?.user?.id, "slot": time });
                bookingsbydate.push({ "date": selectedDate, "bookings": bookings });
                let obj = { "docid": id, "bookingsbydate": bookingsbydate };
                console.log(" +++++ obj++++ " + obj)
                const patchDoctorsBookings2 = async () => {
                    let response2 = await api.patch(`/doctorsbookings/${id}`, obj);
                }
                patchDoctorsBookings2();
            }
        }
        if (state?.loggedInUser?.user != null) {
            const bookingsbydate = state?.userbookings[0].bookingsbydate;

            console.log("state = " + JSON.stringify(state));
            console.log("state?.userbookings?.bookings?.bookingsbydate =" + JSON.stringify(state?.userbookings[0]?.bookings))
            if (doesBookingExist) {
                console.log("bookingsbydate = " + JSON.stringify(bookingsbydate))
                bookingsbydate?.map((userBooking) => {
                    console.log("userBooking =>>>>> " + userBooking?.date + " selectedDate" + selectedDate);
                    if (userBooking?.date === selectedDate) {
                        userBooking?.bookings?.push({ "docId": id, "slot": time });
                        console.log(userBooking?.bookings);

                        let obj1 = { "userid": state.loggedInUser.user.id, "bookingsbydate": bookingsbydate };
                        const patchUsersBookings3 = async () => {
                            let response2 = await api.patch(`/usersbookings/${userId}`, obj1);
                        }
                        patchUsersBookings3();
                    }
                })
            }
            if (!doesBookingExist) {
                console.log("state , selectedDate" + JSON.stringify(state) + "~~~~~~~" + selectedDate);
                console.log("bookingsbydate = " + JSON.stringify(bookingsbydate))
                let userBookings = [];
                userBookings?.push({ "docId": id, "slot": time });
                bookingsbydate?.push({ "date": selectedDate, "bookings": userBookings });
                let obj1 = { "userid": state?.loggedInUser?.user?.id, "bookingsbydate": bookingsbydate };
                console.log("id = obj1" + id + "========" + obj1);
                const patchUsersBookings4 = async () => {
                    let response2 = await api.patch(`/usersbookings/${userId}`, obj1);
                }
                patchUsersBookings4();
            }
        }

        history.push('/viewbookedAppointment')

    }
    const showAvalibleSlots = () => {
        return data1?.availableSlots?.map((slot1) => {
            return (
                <button onClick={() => window.confirm("Do you Want to book a slot with time - " + slot1) && bookSlotByDate(slot1)}>{slot1}</button>
            )
        });
    }
    return (
        <>
            <div className="container" style={{
                margin: 'auto',
                float: 'left',
                width: '30%',
                padding: '10px',
                height: '330px',
                display: 'flex'
            }}>

                <div className="ui card">
                    <div className="extra content">
                        {state?.selectedDoctorInfo?.speciality}
                    </div>
                    <div className="content">
                        <div className="header">
                            {state?.selectedDoctorInfo?.fullname}
                        </div>
                        <div className="meta">{state?.selectedDoctorInfo?.experience}</div>
                        <div className="description">
                            <p></p>
                            <p>doctor's Description</p>
                        </div>
                    </div>
                    <div className="extra content">
                        {state?.selectedDoctorInfo?.number}
                    </div>
                </div>
            </div>
            <div className="container" style={{
                margin: 'auto',
                float: 'left',
                border: '3px solid green',
                width: '70%',
                padding: '10px',
                height: '330px',
            }}>
                <p >Select the slot from below availablity</p>
                <hr />

                <div className="row">
                    <div class="column" style={{ backgroundColor: '#aaa' }}>
                        <form className={classes.container} noValidate>
                            <TextField
                                id="date"
                                onChange={handleChange}
                                label="Tell Us Date To Book A Slot"
                                type="date"
                                defaultValue={todayDate}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                date
                            />
                        </form>
                    </div>
                    <div>
                        <div className="column Container" style={{ backgroundColor: '#bbb' }}>
                            {showAvalibleSlots()}
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Book;