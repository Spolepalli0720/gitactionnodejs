import ConfigCatalog from './ConfigCatalog';

import { connectorService } from '../../services/ConnectorService';

export default class Connectors extends ConfigCatalog {

    getTemplates() {
        return connectorService.getTemplates();
    }

    getData() {
        const { solutionId } = this.props;
        return connectorService.getConnectors(solutionId);
    }

    getDataFilters() {
        let filterKeys = [
            { label: 'Connector', key: 'template' },
            { label: 'Type', key: 'type' },
            { label: 'Active', key: 'active' },
            { label: 'Created By', key: 'createdBy' },
            { label: 'Modified By', key: 'modifiedBy' }
        ];

        return filterKeys;
    }

    onSave(action, payload) {
        const { solutionId } = this.props;
        if ('create' === action) {
            return connectorService.createConnector(solutionId, payload);
        } else if ('update' === action) {
            return connectorService.updateConnector(solutionId, payload);
        }
    }

    onDelete(id) {
        const { solutionId } = this.props;
        return connectorService.deleteConnector(solutionId, id);
    }
}
