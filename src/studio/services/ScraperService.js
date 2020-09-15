import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const scraperService = {
    getTemplates, getScrapers, getScraper, createScraper, updateScraper, deleteScraper
};

function getTemplates() {
    return requestHandler.fetch(`${ServiceConstants.HOST_STORE}/api/templates?category=Scraper`)
}

function getScrapers(solutionId) {
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/scrapers`)
}

function getScraper(solutionId, scraperId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/scrapers/${scraperId}`)
}

function createScraper(solutionId, scraper) {
    return requestHandler.submit(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/scrapers`, scraper)
}

function updateScraper(solutionId, scraper) {
    return requestHandler.update(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/scrapers/${scraper.id}`, scraper)
}

function deleteScraper(solutionId, scraperId) {
    return requestHandler.remove(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/scrapers/${scraperId}`)
}
