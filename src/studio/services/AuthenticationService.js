import { requestHandler } from './RequestHandler';


export const authenticationService = {
    
    getRegions, 
}
const regionURL = "http://cloud-deployer-api.enterprise.digitaldots.ai/api/providers";

function getRegions(cloudProvider) {
    return requestHandler.fetch(`${regionURL}/${cloudProvider}/regions`)
}
