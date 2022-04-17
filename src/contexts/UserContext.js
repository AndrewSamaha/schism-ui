import { createContext } from 'react';

const UserContext = createContext();

const loggedOut = {
    id: 0,
    name: null
};

const initialState = { ...loggedOut };

function userReducer(state, action) {
    let newState;
    console.log({actionType: action.type});
    switch (action.type) {
        case 'loginFromCookie':
            const loginFromCookie = {
                id: 0,
                name: localStorage.getItem('player') || loggedOut.name
            }
            return loginFromCookie;
        case 'login':
            console.log({function: userReducer, user: action.user});
            window.location = '/';
            return action.user;
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

// export default UserContext;
// export default.userReducer = userReducer;

export {
    UserContext,
    userReducer,
    initialState,
    loggedOut
};
