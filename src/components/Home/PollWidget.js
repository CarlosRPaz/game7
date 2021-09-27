import React, { useState } from 'react'
import './styles/PollWidget.css'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, FormHelperText } from '@material-ui/core';

function PollWidget() {

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Pressed Poll Button");
    }

    return (
        <div className="pollWidget">
            <p>Weekly Poll</p>
            <div className="pollWidget-body">
                <h5 className='pollWidget-question'>Which NFL QB owns the single season record for TD passes?</h5>
                <div className="pollWidget-option">option</div>
            </div>
        </div>
    )
}

export default PollWidget
