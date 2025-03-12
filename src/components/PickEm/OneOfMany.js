import React, {Fragment, createContext, forwardRef, useContext, useEffect, useRef, useState} from 'react'
import './styles/OneOfMany.css';
import {
    db,
    addDoc,
    doc,
    getDocs,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    // update doc
    onSnapshot,
    serverTimestamp,
    updateDoc,
} from '../../firebase';
import {useSelector} from 'react-redux';
import {selectUser} from '../../features/userSlice';
import {lighten, darken} from '@mui/system';
import {useTheme, styled} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete, {autocompleteClasses} from '@mui/material/Autocomplete';
import {CircularProgress, ListSubheader, Popper, Typography} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {VariableSizeList} from 'react-window';

function OneOfMany({currentPickEmGame}) {
    const user = useSelector(selectUser);

    const [eachSelection, setEachSelection] = useState();

    const [playersList, setPlayersList] = useState([]);

    const [activePickID, setActivePickID] = useState('');
    const [selectionID, setSelectionID] = useState('');
    //const [isActive, setIsActive] = useState(true);

    // On every component load, load selection from DB
    useEffect(() => {
        // Load selection if it exists
        const loadSelection = async () => {
            const q = query(collection(db, "selections"), where("pickEmGameId", "==", currentPickEmGame.meta_id), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log("selectionId => ", doc.id);
                setActivePickID(doc.data().selectionId);
                setSelectionID(doc.id);
                setValue(doc.data().selectionName);
                setInputValue(doc.data().selectionName)
            });
        }

        if(currentPickEmGame) {
            loadSelection().catch(console.error);
        }
        console.log("CPEG", currentPickEmGame);
    }, [currentPickEmGame, user])

    // On every component load, load selection from DB Load All Players List
    useEffect(() => {
        const loadPlayers = async () => {
            const q = query(collection(db, currentPickEmGame.pool), where("leagueAbbr", "==", currentPickEmGame.leagueAbbr));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                setPlayersList(playersList => [...playersList, {...doc.data(), meta_id: doc.id}]);
            });
        }

        loadPlayers().catch(console.error);
    }, [currentPickEmGame]);

    const sendPick = async (playerId, e) => {
        //e.preventDefault();
        e.target.className += " active";

        // IF selection already exists, UPDATE selection variable, ELSE ADD selection doc
        if(activePickID) {
            const selectionRef = doc(db, 'selections', selectionID);
            await setDoc(selectionRef, {selection: playerId}, {merge: true});
        } else {
            // ADD selection doc
            await addDoc(collection(db, 'selections'), {
                userId: user?.uid,                                // GOOD
                selection: playerId,                              // GOOD
                pickEmGameId: currentPickEmGame?.meta_id,         // GOOD
            });
        }

        // Update local selection variable
        setActivePickID(playerId);
    }

    function Selection({player}) {
        return (
            <button
                onClick={(e) => sendPick(player.meta_id, e)}
                className={player.meta_id === activePickID ? "btn active" : "btn"}
            >
                {player?.name}
            </button>
        )
    }

    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    const GroupHeader = styled('div')(({theme}) => ({
        position: 'sticky',
        top: '-8px',
        padding: '4px 10px',
        color: theme.palette.primary.main,
        backgroundColor:
            theme.palette.mode === 'light'
                ? lighten(theme.palette.primary.light, 0.85)
                : darken(theme.palette.primary.main, 0.8),
    }));

    const GroupItems = styled('ul')({
        padding: 0,
    });
    /*
        const options = playersList.map((option) => {
            const team = option.name[0].toUpperCase();
            return {
                team: /[0-9]/.test(team) ? '0-9' : team,
                ...option,
            };
        });
    */
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;

    useEffect(() => {
        let active = true;

        if(!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if(active) {
                setOptions([...playersList]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if(!open) {
            setOptions([]);
        }
    }, [open]);

    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////

    const [value, setValue] = useState();
    const [inputValue, setInputValue] = useState('');
    const [playerId, setPlayerId] = useState('');

    const selectPlayer = async (newValue) => {
        console.log("newValue", newValue);
        // set value state
        setValue(newValue.name);

        if(selectionID) {
            // if selection exists, update selection with new value
            const selectionRef = doc(db, "selections", selectionID);
            await updateDoc(selectionRef, {
                selectionId: newValue.meta_id,
                selectionName: newValue.name
            }, {merge: true});
            console.log("fxn SID", selectionID);
        } else {
            // else send new selection to Firestore; new doc
            const docData = {
                pickEmGameId: currentPickEmGame.meta_id,
                userId: user.uid,
                selectionId: newValue.meta_id,
                selectionName: newValue.name
            }
            const docRef = await addDoc(collection(db, "selections"), docData);
            // set selection doc id state
            //setYGRA(docRef.id);
            console.log(docRef.id);
        }
    }

    return (
        (<div className="oneOfMany">
            <h1>OneOfMany component</h1>
            {/*
            <div id="btnContainer">
                {playersList && playersList.map((player, index) => (
                    <Selection key={player.meta_id} player={player} />
                ))}
            </div>
            */}
            <div className="autocompleteComponent">
                {/*
                <Autocomplete
                    id="grouped-demo"
                    options={options.sort((a, b) => -b.team.localeCompare(a.team))}
                    groupBy={(option) => option.team}
                    getOptionLabel={(option) => option.name}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="With categories" />}
                    renderGroup={(params) => (
                        <li key={params.key}>
                            <GroupHeader>{params.group}</GroupHeader>
                            <GroupItems>{params.children}</GroupItems>
                        </li>
                    )}
                />
                */}

                <Autocomplete
                    id="asynchronous-demo"
                    //value={value}
                    onChange={(e, newValue) => {
                        selectPlayer(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                        console.log("newInputValue", newInputValue);
                    }}
                    sx={{width: 300}}
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    groupBy={(option) => option.team}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => option.name}
                    options={options.sort((a, b) => -b.team.localeCompare(a.team))}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select a player"
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    endAdornment: (
                                        <Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </Fragment>
                                    ),
                                }
                            }}
                        />
                    )}
                />
            </div>
            <div className="oneOfMany-selection">
                <h3>Your selection:</h3>
                <div className="oneOfMany-selectionName">
                    {
                        value ? `${value !== null ? `${value}` : 'null'}`
                            : 'No selection exists'
                    }
                </div>
            </div>
        </div>)
    );
}

export default OneOfMany