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
                <form>
                    <h5 className='pollWidget-question'>Which NFL QB owns the single season record for TD passes?</h5>
                    <div>
                        <div>
                            <input type="radio" id="contactChoice1"
                                name="contact" value="option1" />
                            <label htmlFor="contactChoice1">Tom Brady</label>
                        </div>
                        <div>
                            <input type="radio" id="contactChoice2"
                                name="contact" value="option2" />
                            <label htmlFor="contactChoice2">Peyton Manning</label>
                        </div>
                        <div>
                            <input type="radio" id="contactChoice3"
                                name="contact" value="option3" />
                            <label htmlFor="contactChoice3">Drew Brees</label>
                        </div>
                        <div>
                            <input type="radio" id="contactChoice4"
                                name="contact" value="option4" />
                            <label htmlFor="contactChoice4">Joe Montana</label>
                        </div>

                    </div>
                    <div>
                        <button
                            type="submit"
                            className="pollWidget-submitBtn"
                        >
                            Submit
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default PollWidget
