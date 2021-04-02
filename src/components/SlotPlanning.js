import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import _ from 'underscore'

let availableSlots = [];

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

function SlotPlanning(props) {
    let dt = new Date();
    let todayDate = dt.getFullYear() + "-" + ((dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : "0" + (dt.getMonth() + 1)) + "-" + (dt.getDate() < 10 ? ("0" + dt.getDate()) : dt.getDate());
    const [selectedDate, setSelectedDate] = useState(todayDate)
    const classes = useStyles();

    const [mySlot, setMySlot] = useState(availableSlots);
    const state = useSelector(state => state.data);
    const dispatch = useDispatch();


    const handleChange = (event) => {
        setSelectedDate(event?.target?.value);
        console.log(availableSlots);
        availableSlots.map((s) => { s.selectedDate === event?.target?.value && setMySlot(s.slot) });
        getAllAvailbleSlots(event?.target?.value);
    }

    useEffect(() => {
        const postDataFromJson = async () => {
            const response = await api.get('/mydoctors');
            //console.log("response.data = " + JSON.stringify(response.data));
            dispatch({ type: "POST_DOCTOR", payload: response.data });
        }
        postDataFromJson();
        getAllAvailbleSlots(todayDate);
    }, [])

    const id = state?.loggedInUser?.user?.id;
    availableSlots = state?.myDoctors?.doctors[id - 1]?.slotsAvailable

    console.log("state.myDoctors.doctors[id].slotsAvailable" +
        JSON.stringify(availableSlots));

    const getAllAvailbleSlots = (date) => {
        console.log(date)
        let flag = true;
        availableSlots.map((dte) => {
            if (flag)
                state.time.map((t, index) => {
                    if (dte.selectedDate === date) {
                        flag = false;
                        if (dte.slot.includes(t)) {
                            document.getElementById(`item${index}`).
                                checked = true;
                        }
                        else {
                            document.getElementById(`item${index}`).checked = false;
                        }
                    }
                    else
                        document.getElementById(`item${index}`).checked = false;
                });
        })
    }

    const handleChecked = (slot) => {
        availableSlots.map((slots) => {
            if (!slots.slot.includes(slot)) {
                slots.slot.push(slot)
            }
            else {
                const index = slots.slot.indexOf(slot);
                if (index > -1) {
                    slots.slot.splice(index, 1);
                }
            }
        })
        setMySlot(availableSlots)
    }

    const createAvailableSlots = async () => {
        const newslots = mySlot;
        const obj = state?.myDoctors?.doctors[id - 1]
        const response = await api.patch(`/mydoctors/${id}`, obj);
        console.log(JSON.stringify(response.data))
        dispatch({ type: "SELECTED_DOCTOR", payload: response.data });
        console.log(JSON.stringify(state))
    }

    const getTimeSlot = () => {
        return state?.time.map((t, item) => {
            console.log("t == availableSlots[item] = " + t + "item = " + item + " and slotsAvail[item]" + availableSlots[item])
            return (
                <div class="ui checkbox" ><input name="slot" type="checkbox" id={`item${item}`} readonly="" tabindex="0" key={item}
                    onChange={(e) => { handleChecked(`${t}`) }} /><label>{t}</label></div>
            );
        })
    }
    return (
        <div>

            <div class="column ui raised red segment" style={{
                marginLeft: '150px', height: '410px'
            }} >
                <form className={classes.container} noValidate>
                    <TextField
                        id="date"
                        onChange={handleChange}
                        label="Tell Us Your Available Slots"
                        type="date"
                        defaultValue={todayDate}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        date
                    />
                </form>
                <div style={{
                    marginTop: '00px',
                    marginLeft: '0px',
                    width: '180px',
                    height: '269px',
                    border: '1px solid black',
                    float: 'right'
                }}>
                    <p>Select your available slots</p>
                    {getTimeSlot()}
                    <div style={{
                        marginTop: '10px'
                    }}>
                        <button className="ui button primary" onClick={() => createAvailableSlots()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SlotPlanning;