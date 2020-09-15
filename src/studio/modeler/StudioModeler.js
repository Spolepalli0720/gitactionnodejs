import inherits from 'inherits';
import { forEach } from 'min-dash';
import { domify, query as domQuery } from 'min-dom';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import workflowPropertiesPanel from 'bpmn-js-properties-panel';
import workflowPropertiesProvider from './workflow-properties';
import customModule from './studio-modules'
import workflowModdle from './studio-moddle/WorkflowModdle';

export default function StudioModeler(options) {

    const studioConfig = {
        studioType: options.studioType,
        keyboard: {
            bindTo: window.document
        },
        additionalModules: [
            customModule
        ],
        moddleExtensions: {
            custom: workflowModdle
        }
    };

    if (options.paletteContainer) {
        studioConfig.paletteContainer = options.paletteContainer
        studioConfig.paletteItems = options.paletteItems
    }

    if (options.propertiesContainer) {
        studioConfig.propertiesPanel = {
            parent: options.propertiesContainer
        }
        studioConfig.additionalModules.push(workflowPropertiesProvider);
        studioConfig.additionalModules.push(workflowPropertiesPanel);
    }

    if (options.canvasContainer) {
        studioConfig.container = options.canvasContainer;
    }

    BpmnModeler.call(this, studioConfig);

    const parent = this;
    parent.on('selection.changed', function (e) {
        if (parent._modules.filter(arrayItem => arrayItem.contextPadProvider).length > 0) {
            const contextPad = parent.get('contextPad');
            const overlays = parent.get('overlays');
            changeContextPadEntries(contextPad, overlays)
        }
    });
    parent.on('element.changed', function (e) {
        if (parent._modules.filter(arrayItem => arrayItem.contextPadProvider).length > 0) {
            const contextPad = parent.get('contextPad');
            const overlays = parent.get('overlays');
            changeContextPadEntries(contextPad, overlays)
        }
    });
    // parent.on('element.changed', function (e) {
    //     if (parent._modules.filter(arrayItem => arrayItem.contextPadProvider).length > 0) {
    //         const contextPad = parent.get('contextPad');
    //         const overlays = parent.get('overlays');
    //         hideContextPadEntries(contextPad, overlays)
    //     }
    // });

    if (options.paletteContainer) {
        if ('string' === typeof options.paletteContainer) {
            var paletteEntries = domQuery('.djs-palette-entries', document.getElementById(options.paletteContainer));
            if(paletteEntries) {
                const UNUSED_TASKS_CLASS = [
                    // 'entry bpmn-icon-send-task',
                    // 'entry bpmn:ReceiveTask',
                    // 'entry bpmn-icon-receive-task',
                    // 'entry bpmn-icon-user-task',
                    // 'entry bpmn:ManualTask',
                    // 'entry bpmn:BusinessRuleTask',
                    // 'entry bpmn-icon-service-task',
                    // 'entry bpmn:ScriptTask',
                    'entry bpmn-icon-data-store'
                ];
                // if('WORKFLOW' === options.studioType) {
                //     UNUSED_TASKS_CLASS.push('entry bpmn-icon-task');
                // }
                var unusedGroups = []
                forEach(paletteEntries.childNodes, function (group) {
                    if(['tools'].indexOf(group.getAttribute('data-group')) >= 0) {
                        unusedGroups.push(group);
                    } else {
                        var unusedNodes = [];
                        forEach(group.childNodes, function (groupItem) {
                            if(UNUSED_TASKS_CLASS.indexOf(groupItem.getAttribute('class')) >= 0) {
                                unusedNodes.push(groupItem);
                            }
                        })
                        unusedNodes.forEach(function (arrayItem) { group.removeChild(arrayItem) });
                    }
                })
                unusedGroups.forEach(function (arrayItem) { paletteEntries.removeChild(arrayItem) });
            }
        }
    }

    function changeContextPadEntries(contextPad, overlays) {
        if (contextPad && contextPad._overlayId && overlays) {
            const overlay = overlays.get(contextPad._overlayId);
            const CONTEXT_ICON_SIZE = 18;
            // overlay.htmlContainer :: djs-overlay-context-pad
            // overlay.html :: djs-context-pad
            const DEFAULT_POSITION_ELEMENTS = [
                'bpmn:SequenceFlow', 'bpmn:DataInputAssociation', 'bpmn:DataOutputAssociation', 'bpmn:Association'
            ];
            // console.log('overlay.element:', overlay.element);
            if(overlay.html.childNodes.length > 0) {
                var elementCount = 0;
                var elementWidth = overlay.element.width;
                var elementHeight = overlay.element.height;
                if (elementHeight < 58) {
                    elementHeight += 10;
                } else {
                    // elementHeight = elementHeight - 17;
                    elementHeight += 10;
                }
                
                if(DEFAULT_POSITION_ELEMENTS.indexOf(overlay.element.type) < 0) {
                    overlay.htmlContainer.style.top = elementHeight + 'px';
                    overlay.htmlContainer.style.height = CONTEXT_ICON_SIZE + 'px';
                    overlay.html.style.height = CONTEXT_ICON_SIZE + 'px';
                    overlay.html.style.width = '100%';
                }

                forEach(overlay.html.childNodes, function (group) {
                    group.style.height = CONTEXT_ICON_SIZE + 'px';
                    group.style.float = 'left';
                    var unusedNodes = [];
                    forEach(group.childNodes, function (groupChild) {
                        groupChild.setAttribute('class', groupChild.getAttribute("class") + ' studio-context-pad-icon')
                        let groupChildAction = groupChild.getAttribute("data-action");
                        if (['append.text-annotation', 'delete', 'connect'].indexOf(groupChildAction) < 0) {
                            groupChild.style.display = 'none';
                            unusedNodes.push(groupChild);
                        } else {
                            elementCount++;
                        }
                    })
                    unusedNodes.forEach(function (arrayItem) { group.removeChild(arrayItem) });
                })
    
                if(options.launchRuleEditor && ['bpmn:BusinessRuleTask', 'bpmn:ScriptTask'].indexOf(overlay.element.type) >= 0) {
                    let launchRuleEditor = domify("<div class='entry-studio-context-pad fa fa-gavel studio-context-pad-icon' data-action='launch-editor' title='Rule Editor' />")
                    launchRuleEditor.onclick = options.launchRuleEditor;
                    overlay.html.childNodes[overlay.html.childNodes.length - 1].insertBefore(launchRuleEditor,
                        overlay.html.childNodes[overlay.html.childNodes.length - 1].childNodes[0]);
                    elementCount++;
                }
    
                if (options.toggleProperties) {
                    let togglePropsIcon = domify("<div class='entry-studio-context-pad feather icon-settings studio-context-pad-icon' data-action='toggle-props' title='Properties' />")
                    togglePropsIcon.onclick = options.toggleProperties;
                    overlay.html.childNodes[overlay.html.childNodes.length - 1].insertBefore(togglePropsIcon, 
                        overlay.html.childNodes[overlay.html.childNodes.length - 1].childNodes[0]);
                    elementCount++;
                }
    
                if(DEFAULT_POSITION_ELEMENTS.indexOf(overlay.element.type) < 0) {
                    if (elementWidth < 58) {
                        overlay.htmlContainer.style.left = '-10px';
                    } else {
                        overlay.htmlContainer.style.left = (elementWidth - (elementCount * (CONTEXT_ICON_SIZE + 2)) - 2) + 'px'
                    }
                    overlay.htmlContainer.style.width = (elementCount * (CONTEXT_ICON_SIZE + 2))+'px';
                    // console.log('elementWidth', elementWidth, 'elementHeight', elementHeight, 'elementCount', elementCount, overlay.element);    
                }
            }
        }
    }
}
inherits(StudioModeler, BpmnModeler);

// include the following to change theme
// this.modeler = new BpmnModeler({
//     [....],
//     bpmnRenderer: {
//         defaultFillColor: '#333',
//         defaultStrokeColor: '#fff'
//       },
//       textRenderer: {
//         defaultStyle: {
//           fontFamily: 'Verdana',
//           fontWeight: 'bold',
//           fontSize: 12,
//           lineHeight: 16
//         },
//         externalStyle: {
//           fontSize: 12,
//           lineHeight: 16
//         }
//       }  
// }); 
