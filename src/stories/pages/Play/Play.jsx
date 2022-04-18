import React, { useRef, useState, useReducer } from 'react';
import { useNavigate, withRouter } from 'react-router-dom';
import { Header } from '../../organisms/Header/Header';
import { Canvas, useFrame } from '@react-three/fiber';
import { UserContext, userReducer, initialState } from '../../../contexts/UserContext';
import './play.css';

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export const Play = () => {
  const [user, setUser] = React.useState();
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <article>
      <Header
        user={user}
        onLogin={() => window.location = '/login'} // navigate('/login')} // setUser({ name: 'Jane Doe' })}
        onLogout={() => {
            dispatch({type: 'logout'})
        }}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />
      <Canvas className="homedemo" style={{width: '100%', height: '100%'}}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.6, 0, 0]} />
        <Box position={[1.6, 0, 0]} />
      </Canvas>
    </article>
  );
};
