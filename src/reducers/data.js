const INITIAL_STATE = {
    myUsers: { users: [] },
    myDoctors: { doctors: [] },
    loggedInUser: { user: null },
    isDoctor: false,
    doctorsbookings: { slots: [] },
    userbookings: { bookings: [] },
    selectedDoctorInfo: null,
    toggleLoginLogout: true,
    time: ["00:00AM", "01:00AM", "02:00AM", "03:00AM", "04:00AM", "05:00AM", "06:00AM", "07:00AM", "08:00AM", "09:00AM", "10:00AM", "11:00AM", "12:00PM", "01:00PM", "02:00PM", "03:00PM", "04:00PM", "05:00PM", "06:00PM", "07:00PM", "08:00PM", "09:00PM", "10:00PM", "11:00PM"]
};

const reducer = (state = INITIAL_STATE, action) => {
    const { bookings } = INITIAL_STATE.userbookings;
    const { slots } = INITIAL_STATE.doctorsbookings;

    switch (action.type) {
        case 'POST_USER':
            return { ...state, myUsers: { users: action.payload } };
        case 'USER_LOGIN':
            return { ...state, loggedInUser: { user: action.payload } };
        case 'REGISTER_USER_OR_DOCTOR':
            return { ...state, isDoctor: action.payload };
        case 'POST_DOCTOR':
            return { ...state, myDoctors: { doctors: action.payload } };
        case 'USER_BOOKINGS':
            return { ...state, userbookings: [...bookings, action.payload] };
        case 'DOCTORS_BOOKINGS':
            return { ...state, doctorsbookings: [...slots, action.payload] };
        case 'SELECTED_DOCTOR':
            return { ...state, selectedDoctorInfo: action.payload };
        case 'BOOK_TIME_SLOT':
            return { ...state, selectedDoctorInfo: action.payload };
        case 'TOGGLE_LOGIN_LOGOUT':
            return { ...state, toggleLoginLogout: action.payload };
        default:
            return state;
    }
};
export default reducer;   