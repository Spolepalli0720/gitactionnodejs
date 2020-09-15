export default {
    items: [
        {
            id: 'L2-Solutions',
            title: 'Solutions',
            type: 'group',
            icon: 'icon-support',
            url: '/solutions',
            children: [
                {
                    id: 'L2-Solutions-Dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/solutions/:solutionId/dashboard',
                    classes: 'nav-item',
                    icon: 'fas fa-tachometer-alt'
                },
                {
                    id: 'L2-Solutions-Explainability',
                    title: 'BrandPulse',
                    type: 'item',
                    url: '/solutions/:solutionId/brandpulse',
                    classes: 'nav-item',
                    icon: 'fas fa-chart-bar'
                },
                {
                    id: 'L2-Solutions-UserTask',
                    title: 'User Tasks',
                    type: 'item',
                    url: '/solutions/:solutionId/usertask',
                    classes: 'nav-item',
                    icon: 'fas fa-tasks'
                },
                {
                    id: 'L2-Solutions-Workflows',
                    title: 'Workflows',
                    type: 'item',
                    url: '/solutions/:solutionId/workflows',
                    classes: 'nav-item',
                    icon: 'fas fa-project-diagram'
                },
                {
                    id: 'L2-Solutions-Rules',
                    title: 'Rules',
                    type: 'item',
                    url: '/solutions/:solutionId/rules',
                    classes: 'nav-item',
                    icon: 'fas fa-gavel'
                },
                {
                    id: 'L2-Solutions-Forms',
                    title: 'Forms',
                    type: 'item',
                    url: '/solutions/:solutionId/forms',
                    classes: 'nav-item',
                    icon: 'fab fa-wpforms'
                },
                {
                    id: 'L2-Solutions-Applications',
                    title: 'Applications',
                    type: 'item',
                    url: '/solutions/:solutionId/applications',
                    classes: 'nav-item',
                    icon: 'fas fa-drafting-compass'
                },
                {
                    id: 'L2-Solutions-Functions',
                    title: 'Functions',
                    type: 'item',
                    url: '/solutions/:solutionId/functions',
                    classes: 'nav-item',
                    icon: 'fas fa-code'
                },
                {
                    id: 'L2-Solutions-Models',
                    title: 'Models',
                    type: 'item',
                    url: '/solutions/:solutionId/models',
                    classes: 'nav-item',
                    icon: 'fas fa-cubes'
                },
                {
                    id: 'L2-Solutions-Datasets',
                    title: 'Datasets',
                    type: 'item',
                    url: '/solutions/:solutionId/datasets',
                    classes: 'nav-item',
                    icon: 'fa fa-puzzle-piece'
                },
                {
                    id: 'L2-Solutions-EndPoints',
                    title: 'End Points',
                    type: 'item',
                    url: '/solutions/:solutionId/endpoints',
                    classes: 'nav-item',
                    icon: 'fa fa-snowflake-o'
                },
                {
                    id: 'L2-Solutions-DataStores',
                    title: 'Data Stores',
                    type: 'item',
                    url: '/solutions/:solutionId/datastores',
                    classes: 'nav-item',
                    icon: 'fa fa-database'
                },
                {
                    id: 'L2-Solutions-Connectors',
                    title: 'Connectors',
                    type: 'item',
                    url: '/solutions/:solutionId/connectors',
                    classes: 'nav-item',
                    icon: 'fa fa-link'
                },

                {
                    id: 'L2-Solutions-Scrapers',
                    title: 'Scrapers',
                    type: 'item',
                    url: '/solutions/:solutionId/scrapers',
                    classes: 'nav-item',
                    icon: 'fa fa-comments'
                },
                {
                    id: 'L2-Solutions-Advisor',
                    title: 'Advisor',
                    type: 'item',
                    url: '/solutions/:solutionId/advisor',
                    classes: 'nav-item',
                    icon: 'fa fa-magic'
                },
                {
                    id: 'L2-Solutions-Triggers',
                    title: 'Triggers',
                    type: 'item',
                    url: '/solutions/:solutionId/triggers',
                    classes: 'nav-item',
                    icon: 'fa fa-rocket'
                },

                {
                    id: 'L2-Solutions-Monitor',
                    title: 'Monitor',
                    type: 'item',
                    url: '/solutions/:solutionId/monitor',
                    classes: 'nav-item',
                    icon: 'fa fa-dot-circle-o'
                },
                {
                    id: 'L2-Solutions-Simulations',
                    title: 'Simulations',
                    type: 'item',
                    url: '/solutions/:solutionId/simulations',
                    classes: 'nav-item',
                    icon: 'fa fa-sliders'
                },


                {
                    id: 'L2-Back',
                    title: 'Back',
                    type: 'item',
                    url: '/solutions',
                    classes: 'nav-item',
                    icon: 'fas fa-arrow-circle-left'
                }
            ]
        }
    ]
}