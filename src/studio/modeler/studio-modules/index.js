import CustomRenderer from './CustomRenderer';
import CustomPalette from './CustomPalette';

export default {
    __init__: ['customRenderer', 'customPalette'],
    customRenderer: ['type', CustomRenderer],
    customPalette: ['type', CustomPalette],
};
