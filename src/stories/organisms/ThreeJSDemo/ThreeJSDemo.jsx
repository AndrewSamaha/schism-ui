import { Box } from '../../atoms/Box/Box';
import { Canvas } from '@react-three/fiber';

export const ThreeJSDemo = ({ showLogin, user, onLogin, onLogout, onCreateAccount }) => (
    <Canvas className="homedemo">
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.6, 0, 0]} />
        <Box position={[1.6, 0, 0]} />
    </Canvas>
  );
  
  ThreeJSDemo.propTypes = {
  };
  
  ThreeJSDemo.defaultProps = {
  };
  