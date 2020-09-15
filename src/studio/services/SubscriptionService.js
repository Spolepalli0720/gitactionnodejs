import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const subscriptionService = {
    registerSubscription
}

function registerSubscription(messagingToken) {
    let subscription = {
        topic: 'events',
        userMessagingTokens: [messagingToken]
    }

    return requestHandler.submit(`${ServiceConstants.HOST_AUTHORIZATION}/api/subscriptions`, subscription);
}
