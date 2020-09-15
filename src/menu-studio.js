export default {
    items: [
        {
            id: 'L1',
            title: 'Studio',
            type: 'group',
            icon: 'icon-support',
            children: [
                {
                    id: 'L1-Home',
                    title: 'Home',
                    type: 'item',
                    url: '/home',
                    classes: 'nav-item',
                    icon: 'fas fa-home'
                },
                {
                    id: 'L1-Dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/dashboard',
                    classes: 'nav-item',
                    icon: 'fas fa-user-cog',
                },
                {
                    id: 'L1-UserTask',
                    title: 'User Tasks',
                    type: 'item',
                    url: '/usertask',
                    classes: 'nav-item',
                    icon: 'fas fa-tasks'
                },
                {
                    id: 'L1-Solutions',
                    title: 'Solutions',
                    type: 'item',
                    url: '/solutions',
                    classes: 'nav-item',
                    icon: 'fas fa-atom'
                },
                {
                    id: 'L1-Environments',
                    title: 'Environments',
                    type: 'item',
                    url: '/environments',
                    classes: 'nav-item',
                    icon: 'fas fa-cloud-meatball'
                },
                {
                    id: 'L1-DataStores',
                    title: 'Data Stores',
                    type: 'item',
                    url: '/datastores',
                    classes: 'nav-item',
                    icon: 'fa fa-database'
                },
                {
                    id: 'L1-Reports',
                    title: 'Reports',
                    type: 'item',
                    url: '/reports',
                    classes: 'nav-item',
                    icon: 'fas fa-chart-line'
                },
                {
                    id: 'L1-Templates',
                    title: 'Templates',
                    type: 'item',
                    url: '/templates',
                    classes: 'nav-item',
                    icon: 'fa fa-file-code-o'
                },
                {
                    id: 'L1-AssetStore',
                    title: 'Asset Store',
                    type: 'item',
                    url: '/assetstore',
                    classes: 'nav-item',
                    icon: 'fa fa-shopping-cart'
                },
                {
                    id: 'L1-Authentication',
                    title: 'Authentication',
                    type: 'item',
                    url: '/authentication',
                    classes: 'nav-item',
                    icon: 'fa fa-lock'
                },
                {
                    id: 'L1-Users',
                    title: 'User Management',
                    type: 'item',
                    url: '/users',
                    classes: 'nav-item',
                    icon: 'fas fa-users'
                },
                {
                    id: 'L1-Products',
                    title: 'Products',
                    type: 'item',
                    url: '/products',
                    classes: 'nav-item',
                    icon: 'fab fa-product-hunt'
                },


                {
                    id: 'L1-SignOut',
                    title: 'Sign out',
                    type: 'item',
                    url: '/signout',
                    classes: 'nav-item',
                    icon: 'fas fa-sign-out-alt'
                }
            ]
        }
    ]
}