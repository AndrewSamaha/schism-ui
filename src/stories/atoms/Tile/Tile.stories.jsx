import { Canvas } from '@react-three/fiber';
import { Tile } from './Tile';

export default {
    title: 'Atoms/Tile',
    component: Tile
};

const TemplateWithCanvas = (args) => {
    const { withCanvas } = args;
    const { withAmbientLight } = args;
    let tile = (<Tile {...args} />);
    
    if (!withCanvas) {
        return <> <ambientLight />{tile} </>;
    }
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {tile}
        </Canvas>
    )
}

export const WithCanvas = TemplateWithCanvas.bind({});
WithCanvas.args = {
    primary: true,
    Label: 'Tile',
    geometry: [2,2],
    withCanvas: true
}

export const WithoutCanvas = TemplateWithCanvas.bind({});
WithoutCanvas.args = {
    primary: true,
    Label: 'Tile',
    geometry: [2,2],
    withCanvas: false
}
