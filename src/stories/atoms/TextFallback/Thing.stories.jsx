import { Canvas } from '@react-three/fiber';
import { Thing } from './Thing';

export default {
    title: 'Atoms/Thing',
    component: Thing
};

const TemplateWithCanvas = (args) => {
    const { withCanvas } = args;
    const { withAmbientLight } = args;
    let thing = (<Thing {...args} />);
    
    if (!withCanvas) {
        return <> <ambientLight />{thing} </>;
    }
    return (
        <Canvas>
            <ambientLight />
            {thing}
        </Canvas>
    )
}

export const WithCanvas = TemplateWithCanvas.bind({});
WithCanvas.args = {
    primary: true,
    Label: 'Thing',
    geometry: [2,2,2],
    withCanvas: true
}

export const WithoutCanvas = TemplateWithCanvas.bind({});
WithoutCanvas.args = {
    primary: true,
    Label: 'Thing',
    geometry: [2,2,2],
    withCanvas: false
}
