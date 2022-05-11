import { createContext } from 'react';
import { defaultStartingLocation } from '../constants/clientGame';
import { ViewMoveFriction, ViewMaxVelocity } from '../constants/viewport';
import { limit } from '../helpers/math';

const UserContext = createContext();

const loggedOut = {
    id: 0,
    name: null,
    viewportWorldLocation: defaultStartingLocation,
    viewportVelocity: [0,0],
    userInput: {}
};

const initialState = { ...loggedOut };

function userReducer(state, action) {
    const { payload } = action;
    // console.log('userReducer');
    // console.log({actionType: action.type, state});
    const pushSpeed = 0.2;
    switch (action.type) {
        case 'loginFromCookie':
            const loginFromCookie = {
                ...initialState,
                name: localStorage.getItem('player') || initialState.name,
                loginType: 'loginFromCookie'
            }
            console.log({loginFromCookie});
            return loginFromCookie;
        case 'login':
            console.log({function: userReducer, user: action.user});
            
            const login = {
                ...initialState,
                ...action.user,
                loginType: 'login'
            };
            console.log({login});
            window.location = '/play'; // the code stops running once this happens..fffff
            return login;
        case 'logout':
            localStorage.removeItem('player');
            window.location = '/'
            return loggedOut;
        case 'keydown':
            let userInput = {
                ...state.userInput,
            };
            userInput[action.payload] = 1;
         
            // console.log({payload: action.payload});
            // console.log({userInput});
            return {
                ...state,
                userInput
            };
        case 'keyup':
            if (action.payload in state.userInput) delete state.userInput[action.payload];
            // console.log({userInput: state.userInput});
            return state;
        case 'PUSH_UP':
            return {
                ...state,
                viewportVelocity: [
                    state.viewportVelocity[0],
                    limit(state.viewportVelocity[1] - pushSpeed, -ViewMaxVelocity, ViewMaxVelocity)
                ]
            };
        case 'PUSH_DOWN':
            return {
                ...state,
                viewportVelocity: [
                    state.viewportVelocity[0],
                    limit(state.viewportVelocity[1] + pushSpeed, -ViewMaxVelocity, ViewMaxVelocity)
                ]
            };
        case 'PUSH_LEFT':
            return {
                ...state,
                viewportVelocity: [
                    limit(state.viewportVelocity[0] + pushSpeed, -ViewMaxVelocity, ViewMaxVelocity),
                    state.viewportVelocity[1]
                ]
            };
        case 'PUSH_RIGHT':
            const right = {
                ...state,
                viewportVelocity: [
                    limit(state.viewportVelocity[0] - pushSpeed, -ViewMaxVelocity, ViewMaxVelocity),
                    state.viewportVelocity[1]
                ]
            };
            console.log('right',state.viewportVelocity[0], right.viewportVelocity[0]);
            return right;
        case 'PHYSICS_TIC':
            return {
                ...state,
                ...payload
            }
        default:
            console.log(`unknown action in userReducer: ${action}`);
            console.log({action});
            throw new Error(`unknown action in userReducer: ${action}`);
    }
    // return loggedOut;
}

export {
    UserContext,
    userReducer,
    initialState,
    loggedOut
};
