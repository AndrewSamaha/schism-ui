import { straightLineMoveGenerator } from "../entities/actions";
import { ActionButton } from "../stories/atoms/ActionButton/ActionButton";
import moveEntityIcon from '../stories/assets/ui/Buttons/CreateEntity.png';
import moveEntityIcon_hover from '../stories/assets/ui/Buttons/CreateEntity_hover.png';

// Actions
export const CREATE_ENTITY = {
    name: 'Move',
    longName: 'CREATE_ENTITY',
    generator: straightLineMoveGenerator,
    icon: moveEntityIcon,
    icon_hover: moveEntityIcon_hover,
    ButtonComponent: function (params) {
        return ActionButton(this, params)
    }
};