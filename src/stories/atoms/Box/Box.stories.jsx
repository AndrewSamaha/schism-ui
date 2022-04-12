import { Canvas } from '@react-three/fiber';
import { Box } from './Box';

export default {
    title: 'Atoms/Box',
    component: Box
};

const TemplateWithCanvas = (args) => {
    const { withCanvas } = args;
    const { withAmbientLight } = args;
    let box = (<Box {...args} />);
    
    if (!withCanvas) {
        return <> <ambientLight />{box} </>;
    }
    return (
        <Canvas>
            <ambientLight />
            {box}
        </Canvas>
    )
}

export const WithCanvas = TemplateWithCanvas.bind({});
WithCanvas.args = {
    primary: true,
    Label: 'Box',
    geometry: [2,2,2],
    withCanvas: true
}

export const WithoutCanvas = TemplateWithCanvas.bind({});
WithoutCanvas.args = {
    primary: true,
    Label: 'Box',
    geometry: [2,2,2],
    withCanvas: false
}
