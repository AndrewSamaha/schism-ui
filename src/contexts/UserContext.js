import { createContext } from 'react';
import { defaultStartingLocation } from '../constants/clientGame';

const UserContext = createContext();

const loggedOut = {
    id: 0,
    name: null,
    viewportWorldLocation: defaultStartingLocation
};

const initialState = { ...loggedOut };

function userReducer(state, action) {
    let newState;
    console.log('userReducer');
    console.log({actionType: action.type, state});
    switch (action.type) {
        case 'loginFromCookie':
            const loginFromCookie = {
                ...initialState,
                name: localStorage.getItem('player') || initialState.name
            }
            console.log({loginFromCookie});
            debugger;
            return loginFromCookie;
        case 'login':
            console.log({function: userReducer, user: action.user});
            
            const login = {
                ...initialState,
                ...action.user
            };
            console.log({login});
            window.location = '/play'; // the code stops running once this happens..fffff
            debugger;
            return login;
        case 'logout':
            localStorage.removeItem('player');
            window.location = '/'
            return loggedOut;
        default:
            console.log(`unknown action in userReducer: ${action}`);
            console.log({action});
            throw new Error(`unknown action in userReducer: ${action}`);
    }
    return loggedOut;
}

export {
    UserContext,
    userReducer,
    initialState,
    loggedOut
};
