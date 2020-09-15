import inherits from 'inherits';
import StudioNavigator from './StudioNavigator';

export default function StudioViewer(options) {
    StudioNavigator.call(this, options);
}
inherits(StudioViewer, StudioNavigator);

StudioViewer.prototype._modules = [].concat(
    StudioNavigator.prototype._modules
        .filter(arrayItem => !arrayItem.zoomScroll)
        .filter(arrayItem => !arrayItem.autoScroll)
);
