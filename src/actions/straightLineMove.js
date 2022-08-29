import { straightLineMoveGenerator } from "../entities/actions";
import { ActionButton } from "../stories/atoms/ActionButton/ActionButton";
import moveEntityIcon from '../stories/assets/ui/Buttons/MoveEntity.png';
import moveEntityIcon_hover from '../stories/assets/ui/Buttons/MoveEntity_hover.png';

// Actions
export const STRAIGHT_LINE_MOVE = {
    name: 'Move',
    longName: 'STRAIGHT_LINE_MOVE',
    generator: straightLineMoveGenerator,
    icon: moveEntityIcon,
    icon_hover: moveEntityIcon_hover,
    ButtonComponent: function (params) {
        return ActionButton(this, params)
    }
};