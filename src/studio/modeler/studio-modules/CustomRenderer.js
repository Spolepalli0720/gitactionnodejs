import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { getStrokeColor, getFillColor, getSemantic } from 'bpmn-js/lib/draw/BpmnRenderUtil';
import { getImage as getWorkflowImage } from '../StudioImageMap'

import {
    append as svgAppend,
    attr as svgAttr,
    // classes as svgClasses,
    create as svgCreate,
    // remove as svgRemove
} from 'tiny-svg';

import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil';
import { is } from 'bpmn-js/lib/util/ModelUtil';
//import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

const HIGH_PRIORITY = 1500,
    TASK_BORDER_RADIUS = 10;
    //INNER_OUTER_DIST = 3;

const DEFAULT_FILL_OPACITY = .95;
    //HIGH_FILL_OPACITY = .35;

// Implementation Reference :: bpmn-js-example-custom-rendering

export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, config, styles, pathMap, bpmnRenderer) {
        // d:'m 0,0 {e.x1},0 {e.x0},{e.y0} 0,{e.y1} -{e.x2},0 0,-{e.y2} {e.x1},0 0,{e.y0} {e.x0},0',
        // pathMap.pathMap['DATA_OBJECT_PATH'].d = 'm 0,0 {e.x1},0 {e.x0},{e.y0} 0,{e.y1} -{e.x2},0 0,-{e.y2} {e.x1},0 0,{e.y0} {e.x0},0';
        // pathMap.pathMap['DATA_OBJECT_PATH'] = pathMap.pathMap['bpmn:Task'];
        super(eventBus, HIGH_PRIORITY);
        this.studioConfig = config;
        this.studioStyles = styles;
        this.studioSvgMap = pathMap;
        this.bpmnRenderer = bpmnRenderer;
    }

    canRender(element) {
        if (element.labelTarget) {
            return false;
        } else if (element.businessObject && (
            element.businessObject.get('userType') ||
            element.businessObject.get('dataType') ||
            element.businessObject.get('storeType') ||
            element.businessObject.get('taskType') ||
            ['bpmn:Task', 'bpmn:SendTask', 'bpmn:ReceiveTask', 'bpmn:UserTask', 'bpmn:ManualTask',
                'bpmn:BusinessRuleTask', 'bpmn:ServiceTask', 'bpmn:ScriptTask']
                .indexOf(element.businessObject.$type) >= 0
        )) {
            return true;
        } else {
            return false;
        }
    }

    drawShape(parentNode, element) {
        const { studioConfig } = this;

        if (studioConfig.studioType === 'RULEFLOW') {
            element.width = 200;
            if (['bpmn:Task'].indexOf(element.businessObject.$type) >= 0) {
                element.width = 150;
                element.height = 50;
            }
        }
        const shape = this.bpmnRenderer.drawShape(parentNode, element);

        if (element.businessObject.get('userType') || element.businessObject.get('taskType')) {
            while (parentNode.childNodes.length > 2) {
                parentNode.removeChild(parentNode.childNodes[2]);
            }
            this.drawShapeIcon(parentNode, element);
        } else if (element.businessObject.get('dataType') || element.businessObject.get('storeType')) {
            parentNode.removeChild(parentNode.childNodes[0]);
            this.drawShapeIcon(parentNode, element);
        } else if (['bpmn:SendTask', 'bpmn:UserTask', 'bpmn:ManualTask', 'bpmn:BusinessRuleTask', 'bpmn:ServiceTask', 'bpmn:ScriptTask']
            .indexOf(element.businessObject.$type) >= 0) {
            while (parentNode.childNodes.length > 2) {
                parentNode.removeChild(parentNode.childNodes[2]);
            }
            this.drawShapeIcon(parentNode, element);
        } else if (['bpmn:ReceiveTask'].indexOf(element.businessObject.$type) >= 0 && !getSemantic(element).instantiate) {
            while (parentNode.childNodes.length > 2) {
                parentNode.removeChild(parentNode.childNodes[2]);
            }
            this.drawShapeIcon(parentNode, element);
        }
        return shape;
    }

    drawShapeIcon(parentGfx, element) {
        const { studioConfig, studioSvgMap } = this;
        var defaultFillColor = studioConfig && studioConfig.defaultFillColor,
        defaultStrokeColor = studioConfig && studioConfig.defaultStrokeColor;
        var pathData;
        var imageGfx;

        if (element.businessObject.get('userType')) {
            let imageProps = { x: 0, y: 0, width: element.width / 3, height: element.height / 3 };
            try {
                imageProps.href = getWorkflowImage(element.businessObject.get('userType'));
            } catch (error) {
                console.error('Failed to load image for ', element.businessObject.get('userType'), error);
            }
            this.attachCircle(parentGfx, imageProps);
            imageProps.x = (imageProps.width / 4) * -1;
            imageProps.y = (imageProps.height / 4) * -1;
            imageGfx = svgCreate('image', imageProps);
            svgAppend(parentGfx, imageGfx);
        } else if (element.businessObject.get('dataType')) {
            let imageProps = { x: 0, y: 0, width: element.width, height: element.height };
            try {
                imageProps.href = getWorkflowImage(element.businessObject.get('dataType'))
            } catch (error) {
                console.error('Failed to load image for ', element.businessObject.get('dataType'), error);
            }
            // this.attachCircle(parentGfx, imageProps);
            // imageProps.x = (imageProps.width / 4) * -1;
            // imageProps.y = (imageProps.height / 4) * -1;
            imageGfx = svgCreate('image', imageProps);
            svgAppend(parentGfx, imageGfx);
        } else if (element.businessObject.get('storeType')) {
            let imageProps = { x: 10, y: 10, width: element.width - 20, height: element.height - 20 };
            try {
                imageProps.href = getWorkflowImage(element.businessObject.get('storeType'))
            } catch (error) {
                console.error('Failed to load image for ', element.businessObject.get('storeType'), error);
            }
            this.attachRectangle(parentGfx, { width: element.width, height: element.height });
            // imageProps.x = (imageProps.width / 4) * -1;
            // imageProps.y = (imageProps.height / 4) * -1;
            imageGfx = svgCreate('image', imageProps);
            svgAppend(parentGfx, imageGfx);
        } else if (element.businessObject.get('taskType')) {
            let imageProps = { x: 0, y: 0, width: element.width / 3, height: element.height / 3 };
            try {
                imageProps.href = getWorkflowImage(element.businessObject.get('taskType'));
            } catch (error) {
                console.error('Failed to load image for ', element.businessObject.get('taskType'), error);
            }
            this.attachCircle(parentGfx, imageProps);
            imageProps.x = (imageProps.width / 4) * -1;
            imageProps.y = (imageProps.height / 4) * -1;
            imageGfx = svgCreate('image', imageProps);
            svgAppend(parentGfx, imageGfx);
        } else if (['bpmn:SendTask'].indexOf(element.businessObject.$type) >= 0) {
            let imageProps = { x: 0, y: 0, width: element.width / 3, height: element.height / 3 };
            this.attachCircle(parentGfx, imageProps);
            pathData = studioSvgMap.getScaledPath('TASK_TYPE_SEND', { xScaleFactor: 1, yScaleFactor: 1,
                containerWidth: 21-4, containerHeight: 14-3, position: { mx: 0.285-0.285, my: 0.357-0.357 } });
            this.attachPath(parentGfx, pathData, { strokeWidth: 1, fill: getStrokeColor(element, defaultStrokeColor),
                stroke: getStrokeColor(element, defaultStrokeColor)});
        }  else if (['bpmn:ReceiveTask'].indexOf(element.businessObject.$type) >= 0 && !getSemantic(element).instantiate) {
            let imageProps = { x: 0, y: 0, width: element.width / 3, height: element.height / 3 };
            this.attachCircle(parentGfx, imageProps);
            pathData = studioSvgMap.getScaledPath('TASK_TYPE_SEND', { xScaleFactor: 0.9, yScaleFactor: 0.9,
                containerWidth: 21-3, containerHeight: 14-2, position: { mx: 0.3-0.3, my: 0.4-0.4 } });
            this.attachPath(parentGfx, pathData, { strokeWidth: 1, stroke: getStrokeColor(element, defaultStrokeColor)});
        }  else if (['bpmn:UserTask'].indexOf(element.businessObject.$type) >= 0) {
            let imageProps = { x: 0, y: 0, width: element.width / 3, height: element.height / 3 };
            this.attachCircle(parentGfx, imageProps);
            pathData = studioSvgMap.getScaledPath('TASK_TYPE_USER_1', { abspos: { x: 10.75, y: 4 } });
            this.attachPath(parentGfx, pathData, { strokeWidth: 0.5, fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)});
            pathData = studioSvgMap.getScaledPath('TASK_TYPE_USER_2', { abspos: { x: 10.75, y: 4 } });
            this.attachPath(parentGfx, pathData, { strokeWidth: 0.5, fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)});
            pathData = studioSvgMap.getScaledPath('TASK_TYPE_USER_3', { abspos: { x: 10.75, y: 4 } });
            this.attachPath(parentGfx, pathData, { strokeWidth: 0.5, fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)});
        } else if (['bpmn:ManualTask'].indexOf(element.businessObject.$type) >= 0) {
            let imageProps = { x: 0, y: 0, width: element.width / 3, height: element.height / 3 };
            this.attachCircle(parentGfx, imageProps);
            pathData = studioSvgMap.getScaledPath('TASK_TYPE_MANUAL', { abspos: { x: 9.25, y: 10 } });
            this.attachPath(parentGfx, pathData, { strokeWidth: 1, stroke: getStrokeColor(element, defaultStrokeColor)});
        } else if (['bpmn:BusinessRuleTask'].indexOf(element.businessObject.$type) >= 0) {
            let imageProps = { x: 0, y: 0, width: element.width / 3, height: element.height / 3 };
            this.attachCircle(parentGfx, imageProps);
            if (studioConfig.studioType === 'RULEFLOW') {
                pathData = studioSvgMap.getScaledPath('TASK_TYPE_BUSINESS_RULE_HEADER', { abspos: { x: -1.5+8, y: 0 } });
            } else {
                pathData = studioSvgMap.getScaledPath('TASK_TYPE_BUSINESS_RULE_HEADER', { abspos: { x: -1.5, y: 0 } });
            }
            this.attachPath(parentGfx, pathData, { strokeWidth: 1, fill: getFillColor(element, '#aaaaaa'),
                stroke: getStrokeColor(element, defaultStrokeColor)});
            if (studioConfig.studioType === 'RULEFLOW') {
                pathData = studioSvgMap.getScaledPath('TASK_TYPE_BUSINESS_RULE_MAIN', { abspos: { x: -2+8, y: 0 } });
            } else {
                pathData = studioSvgMap.getScaledPath('TASK_TYPE_BUSINESS_RULE_MAIN', { abspos: { x: -2, y: 0 } });
            }
            this.attachPath(parentGfx, pathData, { strokeWidth: 1, stroke: getStrokeColor(element, defaultStrokeColor)});
        } else if (['bpmn:ServiceTask'].indexOf(element.businessObject.$type) >= 0) {
            let imageProps = { x: 0, y: 0, width: element.width / 3, height: element.height / 3 };
            this.attachCircle(parentGfx, imageProps);
            pathData = studioSvgMap.getScaledPath('TASK_TYPE_SERVICE', { abspos: { x: 12-5, y: 18-6 } });
            this.attachPath(parentGfx, pathData, { strokeWidth: 1, fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)});
            pathData = studioSvgMap.getScaledPath('TASK_TYPE_SERVICE_FILL', { abspos: { x: 17.2-5, y: 18-6 } });
            this.attachPath(parentGfx, pathData, { strokeWidth: 0, fill: getFillColor(element, defaultFillColor)});
            pathData = studioSvgMap.getScaledPath('TASK_TYPE_SERVICE', { abspos: { x: 17-5, y: 22-6 } });
            this.attachPath(parentGfx, pathData, { strokeWidth: 1, fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)});
        } else if (['bpmn:ScriptTask'].indexOf(element.businessObject.$type) >= 0) {
            let imageProps = { x: 0, y: 0, width: element.width / 3, height: element.height / 3 };
            this.attachCircle(parentGfx, imageProps);
            if (studioConfig.studioType === 'RULEFLOW') {
                pathData = studioSvgMap.getScaledPath('TASK_TYPE_SCRIPT', { abspos: { x: 11+8, y: 14 } });
            } else {
                pathData = studioSvgMap.getScaledPath('TASK_TYPE_SCRIPT', { abspos: { x: 11, y: 14 } });
            }
            this.attachPath(parentGfx, pathData, { strokeWidth: 1, stroke: getStrokeColor(element, defaultStrokeColor)});
        }
        return imageGfx;
    }

    getShapePath(shape) {
        console.log('CustomRenderer.getShapePath');
        if (is(shape, 'bpmn:Task') || is(shape, 'bpmn:DataObjectReference')) {
            return getRoundRectPath(shape, TASK_BORDER_RADIUS);
        }
        return this.bpmnRenderer.getShapePath(shape);
    }

    attachCircle(parentGfx, imageProps) {
        const { studioStyles } = this;
        var offset = imageProps.offset || 0;
        var cx = imageProps.width / 2,
            cy = imageProps.height / 2;
        var attrs = { fillOpacity: DEFAULT_FILL_OPACITY };
        attrs = studioStyles.computeStyle(attrs, {
            stroke: 'black',
            strokeWidth: 2,
            fill: 'white'
        });

        if (attrs.fill === 'none') {
            delete attrs.fillOpacity;
        }

        var circle = svgCreate('circle');
        svgAttr(circle, { cx: cx / 2, cy: cy / 2, r: Math.round((imageProps.width + imageProps.height) / 4 - offset) });
        svgAttr(circle, attrs);
        svgAppend(parentGfx, circle);
        return circle;
    }

    attachRectangle(parentGfx, imageProps) {
        const { studioStyles } = this;
        var offset = imageProps.offset || 0;

        var attrs = { fillOpacity: DEFAULT_FILL_OPACITY };
        attrs = studioStyles.computeStyle(attrs, {
            stroke: 'black',
            strokeWidth: 2,
            fill: 'white'
        });

        var rect = svgCreate('rect');
        svgAttr(rect, { x: offset, y: offset,
            width: imageProps.width - offset * 2,
            height: imageProps.height - offset * 2,
            rx: TASK_BORDER_RADIUS, ry: TASK_BORDER_RADIUS 
        });
        svgAttr(rect, attrs);    
        svgAppend(parentGfx, rect);
        return rect;
    }

    attachPath(parentGfx, pathData, attrs) {
        const { studioStyles } = this;

        attrs = studioStyles.computeStyle(attrs, [ 'no-fill' ], {
            strokeWidth: 2,
            stroke: 'black'
          });
      
          var path = svgCreate('path');
          svgAttr(path, { d: pathData });
          svgAttr(path, attrs);
      
          svgAppend(parentGfx, path);
      
          return path;
      
    }

}

CustomRenderer.$inject =['eventBus', 'config', 'styles', 'pathMap', 'bpmnRenderer'];

CustomRenderer.prototype.getShapePath = function(element) {
    console.log('CustomRenderer.prototype.getShapePath');
    if (is(element, 'bpmn:DataObjectReference')) {
        return getRoundRectPath(element, TASK_BORDER_RADIUS);
    } else {
        return this.bpmnRenderer.getShapePath(element);
    }
}

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
// Unused :: Consider cleanup
// function drawRect(parentNode, width, height, borderRadius, strokeColor) {
//   const rect = svgCreate('rect');
//   svgAttr(rect, {
//     width: width,
//     height: height,
//     rx: borderRadius,
//     ry: borderRadius,
//     stroke: strokeColor || '#000',
//     strokeWidth: 2,
//     fill: '#fff'
//   });
//   svgAppend(parentNode, rect);
//   return rect;
// }

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
// Unused :: Consider cleanup
// function prependTo(newNode, parentNode, siblingNode) {
//   parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
// }