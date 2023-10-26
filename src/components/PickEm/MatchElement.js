import moment from 'moment'
import React, {useState} from 'react'

function MatchElement({/*matchData, activePickID,*/ sendPick, singleMatchData}) {

    const [selectionTester, setSelectionTester] = useState(singleMatchData.selection)

    return (
        <div className="matchElement">
            <div className="btnContainer">
                {singleMatchData &&
                    <button
                        onClick={(e) => {
                            sendPick(
                                singleMatchData.awayTeam.teamId,
                                singleMatchData.meta_id,
                                singleMatchData.selectionId,
                                e)
                            setSelectionTester(singleMatchData?.awayTeam.teamId)
                        }}
                        className={`btn 
                    ${singleMatchData?.awayTeam?.teamId === selectionTester
                                && singleMatchData.winnerTeamId !== null
                                ? "active" : ""} // blue
                    ${singleMatchData?.winnerTeamId === singleMatchData?.awayTeam?.teamId
                                && singleMatchData?.awayTeam?.teamId === selectionTester
                                ? "won" : ""} //green
                    ${singleMatchData.winnerTeamId === singleMatchData.homeTeam.teamId
                                && singleMatchData.awayTeam.teamId === selectionTester
                                ? "lost" : ""} //red
                    `}

                        disabled={
                            selectionTester === singleMatchData?.awayTeam?.teamId
                            || singleMatchData?.winnerTeamId != null // !== to lock
                            || moment().format('LLL') >= moment(singleMatchData?.gametime?.toDate()).format('LLL')
                        }

                    >
                        <p className="btn-teamName">
                            {singleMatchData?.awayTeam?.rank ? ('(' + singleMatchData?.awayTeam?.rank + ')') : null}{' '}
                            {singleMatchData?.awayTeam?.name || singleMatchData?.awayTeam?.hometown}</p>
                        <p className="btn-teamNickname">{singleMatchData?.awayTeam?.nickname}</p>
                    </button>
                }
                <div className="atSymbol-cont">
                    <img src="https://firebasestorage.googleapis.com/v0/b/game7-blog.appspot.com/o/app%2Fimages%2Fat%20symbol.svg?alt=media&token=5a47c90a-d7e2-4329-a5aa-74b2ab979a1b"
                        alt="@ symbol"
                        className="atSymbol" />
                </div>
                {singleMatchData &&
                    <button
                        onClick={(e) => {
                            sendPick(
                                singleMatchData?.homeTeam?.teamId,
                                singleMatchData?.meta_id,
                                singleMatchData?.selectionId,
                                e)
                            setSelectionTester(singleMatchData?.homeTeam?.teamId)
                        }}
                        className={`btn 
                    ${singleMatchData?.homeTeam?.teamId === selectionTester
                                && singleMatchData?.winnerTeamId !== null
                                ? "active" : ""} // blue
                    ${singleMatchData?.winnerTeamId === singleMatchData?.homeTeam?.teamId
                                && singleMatchData?.homeTeam?.teamId === selectionTester
                                ? "won" : ""} //green
                    ${singleMatchData?.winnerTeamId === singleMatchData?.awayTeam?.teamId
                                && singleMatchData?.homeTeam?.teamId === selectionTester
                                ? "lost" : ""} //red
                    `}

                        disabled={
                            selectionTester === singleMatchData?.homeTeam?.teamId
                            || singleMatchData?.winnerTeamId != null // !== to lock
                            || moment().format('LLL') >= moment(singleMatchData?.gametime?.toDate()).format('LLL')
                        }

                    >
                        <p className="btn-teamName">
                            {singleMatchData?.homeTeam?.rank ? ('(' + singleMatchData?.homeTeam?.rank + ')') : null}{' '}
                            {singleMatchData?.homeTeam?.name || singleMatchData?.homeTeam?.hometown}
                        </p>
                        <p className="btn-teamNickname">{singleMatchData?.homeTeam?.nickname}</p>
                    </button>
                }
            </div>

            <div className="matchInfo">
                <p>{moment(singleMatchData?.gametime?.toDate()).format('dddd MMM Do, h:mm a')}</p>
                <p>{singleMatchData?.stadiumLocation || singleMatchData?.gameLocation}</p>
            </div>
        </div>
    )
}

export default MatchElement