var map = require('lodash/map');

var extensionElementsHelper = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper');

/**
 * Returns true if the attribute 'custom:asyncBefore' is set
 * to true.
 *
 * @param  {ModdleElement} bo
 *
 * @return {boolean} a boolean value
 */
function isAsyncBefore(bo) {
    return !!(bo.get('custom:asyncBefore') || bo.get('custom:async'));
}

module.exports.isAsyncBefore = isAsyncBefore;

/**
 * Returns true if the attribute 'custom:asyncAfter' is set
 * to true.
 *
 * @param  {ModdleElement} bo
 *
 * @return {boolean} a boolean value
 */
function isAsyncAfter(bo) {
    return !!bo.get('custom:asyncAfter');
}

module.exports.isAsyncAfter = isAsyncAfter;

/**
 * Returns true if the attribute 'custom:exclusive' is set
 * to true.
 *
 * @param  {ModdleElement} bo
 *
 * @return {boolean} a boolean value
 */
function isExclusive(bo) {
    return !!bo.get('custom:exclusive');
}

module.exports.isExclusive = isExclusive;

/**
 * Get first 'custom:FailedJobRetryTimeCycle' from the business object.
 *
 * @param  {ModdleElement} bo
 *
 * @return {Array<ModdleElement>} a list of 'custom:FailedJobRetryTimeCycle'
 */
function getFailedJobRetryTimeCycle(bo) {
    return (extensionElementsHelper.getExtensionElements(bo, 'custom:FailedJobRetryTimeCycle') || [])[0];
}

module.exports.getFailedJobRetryTimeCycle = getFailedJobRetryTimeCycle;

/**
 * Removes all existing 'custom:FailedJobRetryTimeCycle' from the business object
 *
 * @param  {ModdleElement} bo
 *
 * @return {Array<ModdleElement>} a list of 'custom:FailedJobRetryTimeCycle'
 */
function removeFailedJobRetryTimeCycle(bo, element) {
    var retryTimeCycles = extensionElementsHelper.getExtensionElements(bo, 'custom:FailedJobRetryTimeCycle');
    return map(retryTimeCycles, function (cycle) {
        return extensionElementsHelper.removeEntry(bo, element, cycle);
    });
}

module.exports.removeFailedJobRetryTimeCycle = removeFailedJobRetryTimeCycle;