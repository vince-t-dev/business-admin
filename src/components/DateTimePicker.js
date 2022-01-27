import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import moment from "moment-timezone";
import Datetime from "react-datetime";

function DateTimePicker(props) {
    const viewMode = props.viewMode || "days";
    const isTimePicker = (viewMode == "time");
    const dateFormat = !isTimePicker ? "YYYY-MM-DD" : false;
    let formatted_value = props.value;
    const [value, setValue] = useState(formatted_value);
    let placeholder = (isTimePicker) ? "HH:mm" : "yyyy-mm-dd";

    // on value change: format value and update jsondata
    useEffect(() => {
        formatted_value = (!isTimePicker) ? moment(value).format("YYYY-MM-DD") : moment(value).format("HH:mm");
        props.updateData(props.name, formatted_value);
    },[value]);

    return (
        <>
            <Datetime
                dateFormat={dateFormat}
                timeFormat={isTimePicker}
                timeConstraints={{ minutes: { step: 15 }}}
                onChange={setValue}
                initialViewMode={viewMode}
                className={viewMode+"-picker"}
                renderInput={(props, openCalendar) => (
                <InputGroup>
                    <Form.Control
                        type="text"
                        value={props.value ? props.value : value}
                        placeholder={placeholder}
                        onFocus={openCalendar} 
                        onChange={() => {}} />
                    <InputGroup.Text><i className={!isTimePicker ? "xpri-calendar" : "xpri-clock"}></i></InputGroup.Text> 
                </InputGroup>
            )} />
        </>
    );
}

export default DateTimePicker;