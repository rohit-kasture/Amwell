import { Route } from "react-router-dom";
import Book from "./Book";
import BookApp from "./BookApp";
import Header from "./Header";
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";
import SlotPlanning from "./SlotPlanning";
import UserProfile from "./UserProfile";
import ViewBookedApp from "./ViewBookedApp";
import ViewMyPatients from "./ViewMyPatients";

function App() {
  return (
    <div className="ui container">
      <Header />
      <Route path="/" exact component={BookApp} />
      <Route path="/bookAppointment" exact component={BookApp} />
      <Route path="/viewbookedAppointment" exact component={ViewBookedApp} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/userprofile/:id" component={UserProfile} />
      <Route path="/book/:id" component={Book} />
      <Route path="/logout" component={Logout} />
      <Route path="/viewMyPatients" component={ViewMyPatients} />
      <Route path="/planSlot" component={SlotPlanning} />
      
    </div>
  );
}

export default App;
