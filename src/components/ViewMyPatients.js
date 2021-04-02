import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';

function ViewMyClientsAppointments(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        const postDataFromJson = async () => {
            const response = await api.get('/mydoctors');
            dispatch({ type: "POST_DOCTOR", payload: response.data });
        }
        postDataFromJson();
    }, []);

    const state = useSelector(state => state.data);

    const { users } = state?.myUsers;
    const { doctors } = state?.myDoctors;
    console.log("doctors" + JSON.stringify(doctors));
    console.log("state" + JSON.stringify(state))

    console.log("users" + JSON.stringify(users))
    const renderTableBody = () => {
        const { bookingsbydate } = state?.doctorsbookings[0];
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
                                        <td>{users[`${appDetail.userId}` - 1].fullname}</td>
                                        <td>{users[`${appDetail.userId}` - 1].number}</td>
                                    </>
                                }
                                <td>{appDetail.slot}</td>
                                <td>Booked</td>
                                <td>notes</td>
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
                                <th>Patient's Name</th>
                                <th>Patient's Number</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableBody()}
                        </tbody>
                    </table>

            }
        </>
    );
}

export default ViewMyClientsAppointments;