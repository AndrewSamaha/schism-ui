import { Canvas } from '@react-three/fiber';
import { ThreeJSDemo } from './ThreeJSDemo';

export default {
    title: 'Organisms/ThreeJSDemo',
    component: ThreeJSDemo,
};

const Template = (args) => <ThreeJSDemo {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
