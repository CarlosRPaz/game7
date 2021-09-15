import React, { useState } from 'react'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, FormHelperText } from '@material-ui/core';

function PollWidget() {

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Pressed Poll Button");
    }

    return (
        <div className="pollWidget">
            weekly poll
        </div>
    )
}

export default PollWidget
