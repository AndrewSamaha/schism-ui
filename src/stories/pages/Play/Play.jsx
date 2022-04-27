import React, { useReducer, useContext, useEffect } from 'react';
import { Header } from '../../organisms/Header/Header';
import { Box } from '../../atoms/Box/Box';
import { ViewportTiles } from '../../molecules/ViewportTiles/ViewportTiles';
import { ViewGeometry } from '../../../constants/viewport';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { UserContext, userReducer, initialState } from '../../../contexts/UserContext';
import { GameContext, gameReducer } from '../../../contexts/GameContext';
import { createClientGameState } from '../../../mock/gameState';
import './play.css';


export const Play = () => {
  console.log('play.render');
  const contextUser = useContext(UserContext);
  const [userState, userDispatch] = useReducer(userReducer, contextUser);
  const [gameState, gameDispatch] = useReducer(gameReducer, createClientGameState());
  
  useEffect(() => {
    console.log('play.useEffect');
    if (!userState.name) {
      console.log('no user logged in, so logging in via userDispatch');
      userDispatch({type: 'loginFromCookie'});
    } else {
      console.log('a user is already logged in: ',userState.name);
    }
    gameDispatch({type: 'initMock'});
  },[])
  // console.log({gameState});
  // console.log({playUserstate: userState});
  // console.log('about to userDispatch(type: loginFromCookie)');
  
  // console.log({ contextUser })
  return (
    <article>
      <Header
        userState={userState}
        onLogin={() => window.location = '/login'} // navigate('/login')} // setUser({ name: 'Jane Doe' })}
        onLogout={() => {
            userDispatch({type: 'logout'})
        }}
      />
      <div onKeyDown={(e) => {console.log(e.key)}} onKeyUp={(e)=>{console.log(e.key)}} tabIndex={-1} >
      <Canvas className="homedemo" style={{width: '100%', height: '100%', minHeight: '700px' ,zIndex: '1', backgroundColor: 'black'}}>
        <perspectiveCamera makeDefault position={[(-ViewGeometry[0]+1)/2, -3, 1]} rotation={[-Math.PI*.12, 0, 0]}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-2, 0, 0]} />
          <Box position={[2, 0, 0]} />
          <ViewportTiles
            gameReducer={{gameState, gameDispatch}}
            userReducer={{userState, userDispatch}}
          />
        </perspectiveCamera>
      </Canvas>
      </div>
    </article>
  );
};
