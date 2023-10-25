import React, {useEffect, useState} from 'react'
import './styles/AdWidget.css'
import {collection, getDocs, onSnapshot, query} from 'firebase/firestore';
import {db} from '../../firebase';
import {Link} from 'react-router-dom';

function PickEmAdWidget() {
    const [pickEmNames, setPickEmNames] = useState([]);

    useEffect(() => {
        const getUserProfileData = async () => {
            const q = query(collection(db, "pickemgames"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setPickEmNames(pickEmNames => [...pickEmNames, doc.data().name]);
                console.log(doc.id, " => ", doc.data().name);
            });

        }

        getUserProfileData();
    }, [])

    if(pickEmNames) {console.log("pEN", pickEmNames)}
    return (
        <div className="adWidget">
            <p>Pick 'Em Games</p>
            <div className="adWidget-body">
                <div className="adWidget-question">
                    Many NFL, CFB, and NBA Pick 'Ems await your predictions!
                </div>

                <div className="adWidget-names">
                    {pickEmNames.map((pickEmName) => (
                        <div key={pickEmName}>{pickEmName}</div>
                    ))}
                </div>
                <div>
                    <Link to={"/pickem/"}>
                        <button
                            className="pollWidget-submitBtn"
                        >
                            Go to Pick 'Ems
                        </button>
                    </Link>
                </div>
            </div>
        </div >
    )
}

export default PickEmAdWidget