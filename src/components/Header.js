import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import icon from '../bookmydoctor.PNG'

const Header = (props) => {
    const state = useSelector(state => state.data);

    return (
        <div className="ui blue inverted segment">
            <div className="ui green inverted pointing menu">
                <img src={icon} alt="" style={{ height: '50px', width: '144px' }} ></img>
                {(state.isDoctor && state.loggedInUser.user != null) ?
                    <Link to="/planSlot" className="item">Plan your slots</Link>
                    :
                    <></>
                }
                <Link to="/bookAppointment" id="bookApp" className=" item">Book appointment</Link>
                {
                    state.loggedInUser.user != null ?
                        <Link to="/viewbookedAppointment" id="myAppointments" className="item">View booked appointments</Link>
                        :
                        <></>
                }
                {(state.isDoctor && state.loggedInUser.user != null) ?
                    <Link to="/viewMyPatients" className="item">View my patients</Link>
                    :
                    <></>
                }
                <div className="item" style={{ float: 'right', textAlign: 'right', marginLeft: 'auto' }}>
                    <p id="user" style={{ margin: 'auto' }}></p>
                    {state.toggleLoginLogout ?

                        <Link to="/login" className="ui primary" > SignIn/Register </Link>
                        :
                        <Link to="/logout" id="logout" className="ui primary" style={{ color: 'blue', paddingLeft: 13 }}> Logout </Link>
                    }
                </div>
            </div>
        </div>
    );
};

export default Header;