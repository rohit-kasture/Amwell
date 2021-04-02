import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/api';
import { Link } from 'react-router-dom';
import history from './history';

function BookApp(props) {
    const dispatch = useDispatch();
    const state = useSelector(state => state.data);
    const id  = state?.loggedInUser?.user?.id;
    const renderList = () => {
        return myDoctors.myDoctors.doctors.map((doc) => {
            return (
                <div class="ui celled list " key={doc.id} >
                    <div class="item">
                        <div class="content" style={{ float: 'right' }}>

                            <button className="ui button primary" onClick={() => state.loggedInUser.user === null ? history.push('/login') : history.push(`/book/${doc.id}`)}>Book Appointment</button>
                        </div>
                        <div class="content">
                            <div class="ui header"><Link to={`/userprofile/${doc.id}`}>{doc.fullname}</Link></div>
                            <div class="header">{doc.speciality}</div>

                        </div>
                    </div>
                </div>
            );
        })
    }
    useEffect(() => {
        const postDataFromJson = async () => {
            const response = await api.get('/mydoctors');
            //console.log("response.data = " + JSON.stringify(response.data));
            dispatch({ type: "POST_DOCTOR", payload: response.data });
        }
        postDataFromJson();

        const postDataFromJson2 = async () => {
            const response = await api.get('/myusers');
            dispatch({ type: "POST_USER", payload: response.data });
        }
        postDataFromJson2();

        const getUsersBookingsFromAPI = async () => {
            const getUsersBookingsFromAPIs = await api.get(`/usersbookings`, {
                params: {
                    userid: `${id}`
                }
            });
            dispatch({ type: "USER_BOOKINGS", payload: getUsersBookingsFromAPIs?.data[0] });
        }
        getUsersBookingsFromAPI();

    }, []);

    const myDoctors = useSelector(state => state.data);
    return (<div>
        {renderList()}
    </div>
    );

}
export default BookApp;