import { createContext } from 'react';
import { defaultStartingLocation } from '../constants/clientGame';
import { ViewPushSpeed, ViewMaxVelocity } from '../constants/viewport';
import { limit } from '../helpers/math';

const UserContext = createContext();

const loggedOut = {
    id: 0,
    name: null,
    viewportWorldLocation: defaultStartingLocation,
    viewportVelocity: [0,0],
    userInput: {},
    resources: {
        gold: 100,
        wood: 20
    }
};

const initialState = { ...loggedOut };

function userReducer(state, action) {
    const { payload } = action;
    switch (action.type) {
        case 'loginFromCookie':
            const loginFromCookie = {
                ...initialState,
                name: localStorage.getItem('player') || initialState.name,
                id: localStorage.getItem('id'),
                loginType: 'loginFromCookie'
            }
            return loginFromCookie;
        case 'logout':
            localStorage.removeItem('player');
            localStorage.removeItem('id')
            localStorage.removeItem('authorization')
            window.location = '/'
            return loggedOut;
        case 'keydown':
            let userInput = {
                ...state.userInput,
            };
            userInput[action.payload] = 1;
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
                    limit(state.viewportVelocity[1] - ViewPushSpeed, -ViewMaxVelocity, ViewMaxVelocity)
                ]
            };
        case 'PUSH_DOWN':
            return {
                ...state,
                viewportVelocity: [
                    state.viewportVelocity[0],
                    limit(state.viewportVelocity[1] + ViewPushSpeed, -ViewMaxVelocity, ViewMaxVelocity)
                ]
            };
        case 'PUSH_LEFT':
            return {
                ...state,
                viewportVelocity: [
                    limit(state.viewportVelocity[0] + ViewPushSpeed, -ViewMaxVelocity, ViewMaxVelocity),
                    state.viewportVelocity[1]
                ]
            };
        case 'PUSH_RIGHT':
            const right = {
                ...state,
                viewportVelocity: [
                    limit(state.viewportVelocity[0] - ViewPushSpeed, -ViewMaxVelocity, ViewMaxVelocity),
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
