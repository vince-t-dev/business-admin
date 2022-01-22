import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import moment from "moment-timezone";
import Datetime from "react-datetime";

function DatePicker(props) {
    const [value, setValue] = useState(props.value || "");
    const viewMode = props.viewMode || "days";
    const isTimePicker = (viewMode == "time");
    const dateFormat = !isTimePicker ? "YYYY-MM-DD" : false;
    let placeholder = (isTimePicker) ? "HH:mm" : "yyyy-mm-dd";

    // update jsondata
    useEffect(() => {
        let formatted_value = !isTimePicker ? moment(value).format("YYYY-MM-DD") : moment(value).format("HH:mm");
        props.updateData(props.name, formatted_value);
    },[value]);

    return (
        <>
            <Datetime
                dateFormat={dateFormat}
                timeFormat={isTimePicker}
                onChange={setValue}
                initialViewMode={viewMode}
                className={viewMode+"-picker"}
                renderInput={(props, openCalendar) => (
                <InputGroup {...props}>
                    <Form.Control
                        type="text"
                        value={props.value}
                        placeholder={placeholder}
                        onFocus={openCalendar} 
                        onChange={() => {}} />
                    <InputGroup.Text><i className={!isTimePicker ? "xpri-calendar" : "xpri-clock"}></i></InputGroup.Text> 
                </InputGroup>
            )} />
        </>
    );
}

export default DatePicker;