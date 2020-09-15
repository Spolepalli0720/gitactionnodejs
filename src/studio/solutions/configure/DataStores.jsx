import ConfigCatalog from './ConfigCatalog';

import { dataStoreService } from '../../services/DataStoreService';

export default class DataStores extends ConfigCatalog {

    getTemplates() {
        return dataStoreService.getTemplates();
    }

    getData() {
        const { solutionId } = this.props;
        return dataStoreService.getDataStores(solutionId);
    }

    getDataFilters() {
        let filterKeys = [
            { label: 'DataStore', key: 'template' },
            {
                label: 'Type', key: 'type', options: [
                    { label: 'NoSQL', value: 'nosql' },
                    { label: 'SQL', value: 'sql' }
                ]
            },
            { label: 'Active', key: 'active' },
            { label: 'Created By', key: 'createdBy' },
            { label: 'Modified By', key: 'modifiedBy' }
        ];

        return filterKeys;
    }

    onSave(action, payload) {
        const { solutionId } = this.props;
        if ('create' === action) {
            return dataStoreService.createDataStore(solutionId, payload);
        } else if ('update' === action) {
            return dataStoreService.updateDataStore(solutionId, payload);
        }
    }

    onDelete(id) {
        const { solutionId } = this.props;
        return dataStoreService.deleteDataStore(solutionId, id);
    }

}
