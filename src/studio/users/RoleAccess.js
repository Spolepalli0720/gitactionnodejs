export default {
    items: [
        {
            name: 'L1',
            title: 'Digital Studio',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    name: 'L1-Home',
                    title: 'Home',
                    icon: 'fas fa-home',
                    actions: { },
                },
                {
                    name: 'L1-Dashboard',
                    title: 'Dashboard',
                    icon: 'fas fa-user-cog',
                    actions: { },
                },
                {
                    name: 'L1-UserTask',
                    title: 'User Tasks',
                    icon: 'fas fa-tasks',
                    actions: { edit: false },
                },
                {
                    name: 'L1-Solutions',
                    title: 'Solutions',
                    icon: 'fas fa-atom',
                    actions: { view: false, create: false, edit: false, delete: false, export: false, manage: false },
                    children: [
                        {
                            name: 'L2-Solutions-Dashboard',
                            title: 'Dashboard',
                            icon: 'fas fa-tachometer-alt',
                            actions: { },
                        },
                        {
                            name: 'L2-Solutions-UserTask',
                            title: 'User Tasks',
                            icon: 'fas fa-tasks',
                            actions: { edit: false },
                        },
                        {
                            name: 'L2-Solutions-Workflows',
                            title: 'Workflows',
                            icon: 'fas fa-project-diagram',
                            actions: { view: false, create: false, edit: false, delete: false, export: false, manage: false, execute: false },
                            children: [
                                {
                                    name: 'L2-Solutions-Workflows-Viewer',
                                    title: 'Workflow Viewer',
                                    actions: { edit: false, execute: false },
                                },
                                {
                                    name: 'L2-Solutions-Workflows-Modeler',
                                    title: 'Workflow Modeler',
                                    actions: { edit: false, export: false, publish: false, execute: false },
                                },
                            ]
                        },
                        {
                            name: 'L2-Solutions-Rules',
                            title: 'Rules',
                            icon: 'fas fa-gavel',
                            actions: { view: false, create: false, edit: false, delete: false, export: false, manage: false },
                            children: [
                                {
                                    name: 'L2-Solutions-Rules-Viewer',
                                    title: 'Ruleflow Viewer',
                                    actions: { edit: false },
                                },
                                {
                                    name: 'L2-Solutions-Rules-Modeler',
                                    title: 'Ruleflow Modeler',
                                    actions: { edit: false, export: false, publish: false },
                                },
                            ]
                        },
                        {
                            name: 'L2-Solutions-Forms',
                            title: 'Forms',
                            icon: 'fab fa-wpforms',
                            actions: { view: false, create: false, edit: false, delete: false, export: false, manage: false },
                            children: [
                                {
                                    name: 'L2-Solutions-Forms-Viewer',
                                    title: 'Forms Viewer',
                                    actions: { edit: false },
                                },
                                {
                                    name: 'L2-Solutions-Forms-Modeler',
                                    title: 'Forms Modeler',
                                    actions: { edit: false, export: false, publish: false },
                                },
                            ]
                        },
                        {
                            name: 'L2-Solutions-Functions',
                            title: 'Functions',
                            icon: 'fas fa-code',
                            actions: { },
                        },
                        {
                            name: 'L2-Solutions-Models',
                            title: 'Models',
                            icon: 'fas fa-cubes',
                            actions: { },
                        },
                        {
                            name: 'L2-Solutions-Datasets',
                            title: 'Datasets',
                            icon: 'fa fa-puzzle-piece',
                            actions: { },
                        },
                        {
                            name: 'L2-Solutions-EndPoints',
                            title: 'End Points',
                            icon: 'fa fa-snowflake-o',
                            actions: { },
                        },
                        {
                            name: 'L2-Solutions-DataStores',
                            title: 'Data Stores',
                            icon: 'fa fa-database',
                            actions: { },
                        },
                        {
                            name: 'L2-Solutions-Advisor',
                            title: 'Advisor',
                            icon: 'fa fa-magic',
                            actions: { },
                        },
                        {
                            name: 'L2-Solutions-Monitor',
                            title: 'Monitor',
                            icon: 'fa fa-dot-circle-o',
                            actions: { },
                        },
                        {
                            name: 'L2-Solutions-Simulations',
                            title: 'Simulations',
                            icon: 'fa fa-sliders',
                            actions: { },
                        },
                    ]
                },
                {
                    name: 'L1-Environments',
                    title: 'Environments',
                    icon: 'fas fa-cloud-meatball',
                    actions: { },
                    children: [
                        {
                            name: 'L2-Environment-Dashboard',
                            title: 'Dashboard',
                            icon: 'fas fa-tachometer-alt',
                            actions: { },
                        },        
                    ]
                },
                {
                    name: 'L1-DataStores',
                    title: 'Data Stores',
                    icon: 'fa fa-database',
                    actions: { },
                },
                {
                    name: 'L1-Reports',
                    title: 'Reports',
                    icon: 'fas fa-chart-line',
                    actions: { },
                },
                {
                    name: 'L1-Templates',
                    title: 'Templates',
                    icon: 'fa fa-file-code-o',
                    actions: { },
                },
                {
                    name: 'L1-AssetStore',
                    title: 'Asset Store',
                    icon: 'fa fa-shopping-cart',
                    actions: { },
                },
                {
                    name: 'L1-Authentication',
                    title: 'Authentication',
                    icon: 'fa fa-lock',
                    actions: { },
                },
                {
                    name: 'L1-Users',
                    title: 'User Management',
                    icon: 'fas fa-users',
                    actions: { },
                },
                {
                    name: 'L1-SignOut',
                    title: 'Sign out',
                    icon: 'fas fa-sign-out-alt',
                    actions: { },
                }
            ]
        }
    ]
}