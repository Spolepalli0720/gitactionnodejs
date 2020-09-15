import ConfigCatalog from './ConfigCatalog';
import { scraperService } from '../../services/ScraperService';

export default class Scrapers extends ConfigCatalog {

    getTemplates() {
        return scraperService.getTemplates();
    }

    getData() {
        const { solutionId } = this.props;
        return scraperService.getScrapers(solutionId);
    }

    getDataFilters() {
        let filterKeys = [
            { label: 'Scraper', key: 'template' },
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
            return scraperService.createScraper(solutionId, payload);
        } else if ('update' === action) {
            return scraperService.updateScraper(solutionId, payload);
        }
    }

    onDelete(id) {
        const { solutionId } = this.props;
        return scraperService.deleteScraper(solutionId, id);
    }

}
