import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from '../api/api';
import history from './history';


function ViewBookedApp(props) {
    const state = useSelector(state => state.data);
    const dispatch = useDispatch();
    const userId = parseInt(state?.loggedInUser?.user?.id);
    useEffect(() => {
        state.loggedInUser.user === null && history.push('/login');

        const displayBooking = async () => {
            const displayBookings = await api.get(`/usersbookings/`, {
                params: {
                    userid: `${userId}`
                }
            });
            dispatch({ type: "USER_BOOKINGS", payload: displayBookings.data[0] });
        }
        displayBooking();
    }, []);
    const { doctors } = state?.myDoctors;
    const { users } = state?.myUsers;

    console.log("users" + JSON.stringify(users))

    const cancelAppointment = (docIdAndslot) => {
        console.log(docIdAndslot);
    }
    const renderTableBody = () => {

        const { bookingsbydate } = state?.userbookings[0];
        console.log(bookingsbydate)
        return bookingsbydate?.map(myBookingsByDate => {
            return (
                <>{
                    myBookingsByDate.bookings.map(appDetail => {
                        return (
                            <tr>
                                <td>{myBookingsByDate.date}</td>
                                {
                                    <>
                                        <td>{doctors[`${appDetail.docId}` - 1].fullname}</td>
                                        <td>{doctors[`${appDetail.docId}` - 1].number}</td>
                                    </>
                                }
                                <td>{appDetail.slot}</td>
                                <td>Booked</td>
                                <td>notes</td>
                                <td>
                                    <button onClick={() => cancelAppointment(`{${appDetail.docId},${appDetail.slot}}`)}>Cancel</button>
                                </td>
                            </tr>
                        );
                    }
                    )
                }</>
            );
        })
    }
    return (
        <>
            {
                state?.loggedInUser?.user === null ?
                    <div>Please login to Book and View your appointments.</div>
                    :
                    <table className="ui single line table">
                        <thead>
                            <tr>
                                <th >Date</th>
                                <th>Doctor's Name</th>
                                <th>Doctor's Number</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Notes</th>
                                <th>Cancel Appointment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableBody()}
                        </tbody>
                    </table>

            }
        </>);
}

export default ViewBookedApp;