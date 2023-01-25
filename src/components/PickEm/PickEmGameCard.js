import React, {useState, useEffect} from 'react'
import './styles/PickEmGameCard.css'

import moment from 'moment';

function PickEmGameCard({pickemGame}) {

    if(pickemGame) {
        console.log(pickemGame);
    }

    return (
        <div className="pickEmGameCard">
            {pickemGame && <>
                <h1>{pickemGame.name}</h1>
                <p>{pickemGame.season ? moment(pickemGame.season.toDate()).format('YYYY') : 'loading...'}</p>
                <p>{pickemGame.leagueAbbr}</p>
                <p>{pickemGame.pickBy ? moment(pickemGame.pickBy.toDate()).format('[Pick by ] MMM Do, h:mm a') : 'loading...'}</p>
            </>}
        </div>

    )
}

export default PickEmGameCard