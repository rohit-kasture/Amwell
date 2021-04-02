import api from '../api/api';
import history from '../components/history';
import { USER_LOGIN, POST_DOCTOR, REGISTER_USER_OR_DOCTOR, TOGGLE_LOGIN_LOGOUT } from './types';

export const toggleIsDoctor = (isDoctorflag) => {
  return { type: REGISTER_USER_OR_DOCTOR, payload: isDoctorflag }
}

export const postUser = (user, isDoctor) => async dispatch => {
  let response, response1 = null;
  if (isDoctor) {
    user = { ...user, "type": "doctor" };
    response = await api.post('/mydoctors', user);
    dispatch({ type: POST_DOCTOR, payload: response.data });
    response1 = await api.post('/doctorsbookings', {
      "docid": response.data.id,
      "bookingsbydate": []
    });
  }
  else {
    user = { ...user, "type": "user" };
    response = await api.post('/myusers', user);

    response1 = await api.post('/usersbookings', {
      "userid": response.data.id,
      "bookingsbydate": []
    });
  }
};
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const loginUser = (user) => async dispatch => {
  let users = await api.get('/myusers');
  let flag = true; let flag2;
  const flag1 = users.data.map((usr) => {
    if ((usr.number) === user['number'] && usr.password === user['password']) {
      let firstName = usr.fullname.split(" ")[0];
      firstName = capitalizeFirstLetter(firstName);
      document.getElementById("user").innerText = `Welcome ${firstName}`;
      dispatch({ type: USER_LOGIN, payload: usr });
//check this because push happened before dispatch
      history.push('/bookAppointment')
      dispatch({ type: TOGGLE_LOGIN_LOGOUT, payload: false })
      flag = false;
      return true;
    }
  }
  );
  if (flag) {
    let doctors = await api.get('/mydoctors');
    flag2 = doctors.data.map((doctor) => {
      if ((doctor.number) === user['number'] && doctor.password === user['password']) {
        let title = doctor.fullname.split(" ")[0]
        let firstName = doctor.fullname.split(" ")[1];
        title = capitalizeFirstLetter(title);
        firstName = capitalizeFirstLetter(firstName);
        let fullName = title + " " + firstName;
        document.getElementById("user").innerText = `Welcome ${fullName}`;
        dispatch({ type: REGISTER_USER_OR_DOCTOR, payload: true });
        dispatch({ type: USER_LOGIN, payload: doctor });
        dispatch({ type: TOGGLE_LOGIN_LOGOUT, payload: false })
        let userId = doctor.id;
        const displayBooking = async () => {
          const displayBookings = await api.get(`/doctorsbookings/`, {
            params: {
              docid: `${userId}`
            }
          });
          dispatch({ type: "DOCTORS_BOOKINGS", payload: displayBookings.data[0] });
          history.push('/planSlot')
        }
        displayBooking();

        history.push('/bookAppointment')
        return true;
      }
    }
    );
  }
  if (!(flag1 || flag2)) {
    dispatch({ type: USER_LOGIN, payload: null });
  }
};
