import inherits from 'inherits';
import StudioModeler from './StudioModeler';

export default function StudioNavigator(options) {
    StudioModeler.call(this, options);
}
inherits(StudioNavigator, StudioModeler);

StudioNavigator.prototype._modules = [].concat(
    StudioModeler.prototype._modules
        .filter(arrayItem => !arrayItem.contextPadProvider)
        .filter(arrayItem => !arrayItem.labelEditingProvider)

        .filter(arrayItem => !arrayItem.keyboardMove)
        .filter(arrayItem => !arrayItem.moveCanvas)
        .filter(arrayItem => !arrayItem.bendpointMove)
        .filter(arrayItem => !arrayItem.connectionSegmentMove)
        .filter(arrayItem => !arrayItem.keyboardBindings)
        .filter(arrayItem => !arrayItem.keyboardMoveSelection)
        .filter(arrayItem => !arrayItem.move)
        .filter(arrayItem => !arrayItem.resize)
        .filter(arrayItem => !arrayItem.resizeHandles)
);
