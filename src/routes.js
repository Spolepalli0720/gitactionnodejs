
// TO display content in dashboard page

import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

// const Login = React.lazy(() => import('./studio/login/Login'));
const SignOut = React.lazy(() => import('./studio/login/SignOut'));

const Home = React.lazy(() => import('./studio/home/Home'));
const Dashboard = React.lazy(() => import('./studio/dashboard/Dashboard'));
const HomeDashboard = React.lazy(() => import("./demo/dashboard/Dashboard"));
// const TaskMetrics = React.lazy(() => import('./studio/dashboard/TaskMetrics'));
// const UserTask = React.lazy(() => import('./studio/user-task/UserTask'));
const Tasks = React.lazy(() => import('./studio/tasks/Tasks'));
const Products = React.lazy(() => import('./studio/products/Products'));
const Solutions = React.lazy(() => import('./studio/solutions/Solutions'));
const Environments = React.lazy(() => import('./studio/environments/Environments'));
const UserMagement = React.lazy(() => import('./studio/users/UserMagement'));
const Profile = React.lazy(() => import('./studio/profile/Profile'));
const DataStores = React.lazy(() => import('./studio/datastores/DataStores'));
const AssetStore = React.lazy(() => import('./studio/assetstore/AssetStore'));
const Authentication = React.lazy(() => import('./studio/authentication/Authentication'));

// const AdminDashboard = React.lazy(() => import('./demo/dashboard/AdminDashboard'));
const BrandPulse = React.lazy(() => import('./demo/dashboard/explainability/Explainability'));
// const ProcessMetrics = React.lazy(() => import('./studio/solutions/dashboard/ProcessMetrics'));
const Workflows = React.lazy(() => import('./studio/solutions/workflows/Workflows'));
const WorkflowViewer = React.lazy(() => import('./studio/modeler/WorkflowViewer'));
const WorkflowModeler = React.lazy(() => import('./studio/modeler/WorkflowModeler'));
const Rules = React.lazy(() => import('./studio/solutions/rules/Rules'));
// const RuleViewer = React.lazy(() => import('./studio/modeler/RuleViewer'));
// const RuleModeler = React.lazy(() => import('./studio/modeler/RuleModeler'));
const DecisionViewer = React.lazy(() => import('./studio/modeler/DecisionViewer'));
const DecisionModeler = React.lazy(() => import('./studio/modeler/DecisionModeler'));
const Forms = React.lazy(() => import('./studio/solutions/applications/Forms'));
const Applications = React.lazy(() => import('./studio/solutions/applications/Applications'));
const LowCodeViewer = React.lazy(() => import('./studio/modeler/LowCodeViewer'));
const LowCodeModeler = React.lazy(() => import('./studio/modeler/LowCodeModeler'));
const Functions = React.lazy(() => import('./studio/solutions/functions/Functions'));
const Models = React.lazy(() => import('./studio/solutions/models/Models'));
const Datasets = React.lazy(() => import('./studio/solutions/datasets/Datasets'));
const Configure = React.lazy(() => import('./studio/solutions/configure/Configure'));
const Monitor = React.lazy(() => import('./studio/solutions/monitor/Monitor'));
const Triggers = React.lazy(() => import('./studio/solutions/triggers/Triggers'));

const EnvironmentDashboard = React.lazy(() => import('./studio/environments/dashboard/dashboard'));

const routes = [
    // Level 1 Menu Items
    { exact: true, id: 'L1-Home', name: 'Home', path: '/home', component: Home },
    // { exact: true, id: 'L1-Dashboard', name: 'Dashboard', path: '/dashboard', component: TaskMetrics },
    { exact: true, id: 'L1-Dashboard', name: 'Dashboard', path: '/dashboard', component: HomeDashboard },
    { exact: true, id: 'L1-Solutions', name: 'Solutions', path: '/solutions', component: Solutions },
    { exact: true, id: 'L1-Environments', name: 'Environments', path: '/environments', component: Environments },
    { exact: true, id: 'L1-UserTask', name: 'User Task', path: '/usertask', component: Tasks },
    { exact: true, id: 'L1-DataStores', name: 'Data Stores', path: '/datastores', component: DataStores },
    { exact: true, id: 'L1-Reports', name: 'Reports', path: '/reports', component: Home },
    { exact: true, id: 'L1-Templates', name: 'Templates', path: '/templates', component: Home },
    { exact: true, id: 'L1-AssetStore', name: 'Asset Store', path: '/assetstore', component: AssetStore },
    { exact: true, id: 'L1-Authentication', name: 'Authentication', path: '/authentication', component: Authentication },
    { exact: true, id: 'L1-Users', name: 'Users', path: '/users', component: UserMagement },
    { exact: true, id: 'L1-Products', name: 'Products', path: '/products', component: Products },

    { exact: true, id: 'L1-SignOut', name: 'SignOut', path: '/signout', component: SignOut },

    // Level 1 Routes for Self-Service
    { exact: true, id: 'L1-Users-Profile', name: 'Profile', path: '/profile', component: Profile },

    // Level 2 Routes for Solutions
    // { exact: true, id: 'L2-Solutions-Dashboard', name: 'Dashboard', path: '/solutions/:solutionId/dashboard', component: ProcessMetrics },
    // { exact: true, id: 'L2-Solutions-Dashboard', name: 'Dashboard', path: '/solutions/:solutionId/dashboard', component: AdminDashboard },
    { exact: true, id: 'L2-Solutions-Dashboard', name: 'Dashboard', path: '/solutions/:solutionId/dashboard', component: Dashboard },
    { exact: true, id: 'L2-Solutions-Explainability', name: 'BrandPulse', path: '/solutions/:solutionId/brandpulse', component: BrandPulse },
    { exact: true, id: 'L2-Solutions-UserTask', name: 'User Task', path: '/solutions/:solutionId/usertask', component: Tasks },
    { exact: true, id: 'L2-Solutions-Workflows', name: 'Workflows', path: '/solutions/:solutionId/workflows', component: Workflows },
    { exact: true, id: 'L2-Solutions-Rules', name: 'Rules', path: '/solutions/:solutionId/rules', component: Rules },
    { exact: true, id: 'L2-Solutions-Forms', name: 'Forms', path: '/solutions/:solutionId/forms', component: Forms },
    { exact: true, id: 'L2-Solutions-Applications', name: 'Applications', path: '/solutions/:solutionId/applications', component: Applications },
    { exact: true, id: 'L2-Solutions-Functions', name: 'Functions', path: '/solutions/:solutionId/functions', component: Functions },
    { exact: true, id: 'L2-Solutions-Models', name: 'Models', path: '/solutions/:solutionId/models', component: Models },
    { exact: true, id: 'L2-Solutions-Datasets', name: 'Datasets', path: '/solutions/:solutionId/datasets', component: Datasets },
    { exact: true, id: 'L2-Solutions-EndPoints', name: 'End Points', path: '/solutions/:solutionId/endpoints', component: Home },
    { exact: true, id: 'L2-Solutions-DataStores', name: 'Data Stores', path: '/solutions/:solutionId/datastores', component: Configure },
    { exact: true, id: 'L2-Solutions-Connectors', name: 'Connectors', path: '/solutions/:solutionId/connectors', component: Configure },
    { exact: true, id: 'L2-Solutions-Scrapers', name: 'Scrapers', path: '/solutions/:solutionId/scrapers', component: Configure },
    { exact: true, id: 'L2-Solutions-Advisor', name: 'Advisor', path: '/solutions/:solutionId/advisor', component: Home },
    { exact: true, id: 'L2-Solutions-Triggers', name: 'Triggers', path: '/solutions/:solutionId/triggers', component: Triggers },
    { exact: true, id: 'L2-Solutions-Monitor', name: 'Monitor', path: '/solutions/:solutionId/monitor', component: Monitor },
    { exact: true, id: 'L2-Solutions-Monitor', name: 'Monitor', path: '/solutions/:solutionId/monitor/:instanceId', component: Monitor },
    { exact: true, id: 'L2-Solutions-Simulations', name: 'Simulations', path: '/solutions/:solutionId/simulations', component: Home },

    // Level 2 Additional Routes for Workflows
    { exact: true, id: 'L2-Solutions-Workflows-Viewer', name: 'WorkflowViewer', path: '/solutions/:solutionId/workflows/:workflowId', component: WorkflowViewer },
    { exact: true, id: 'L2-Solutions-Workflows-Modeler', name: 'WorkflowModeler', path: '/solutions/:solutionId/workflows/:workflowId/editor', component: WorkflowModeler },

    // Level 2 Additional Routes for Rules
    // { exact: true, id: 'L2-Solutions-Rules-Viewer', name: 'RuleflowViewer', path: '/solutions/:solutionId/rules/:ruleId', component: RuleViewer },
    // { exact: true, id: 'L2-Solutions-Rules-Modeler', name: 'RuleflowModeler', path: '/solutions/:solutionId/rules/:ruleId/editor', component: RuleModeler },
    { exact: true, id: 'L2-Solutions-Rules-Viewer', name: 'DecisionViewer', path: '/solutions/:solutionId/rules/:decisionId', component: DecisionViewer },
    { exact: true, id: 'L2-Solutions-Rules-Modeler', name: 'DecisionModeler', path: '/solutions/:solutionId/rules/:decisionId/editor', component: DecisionModeler },

    // Level 2 Additional Routes for Applications
    { exact: true, id: 'L2-Solutions-Forms-Viewer', name: 'LowCodeViewer', path: '/solutions/:solutionId/forms/:formId', component: LowCodeViewer },
    { exact: true, id: 'L2-Solutions-Forms-Modeler', name: 'LowCodeViewer', path: '/solutions/:solutionId/forms/:formId/editor', component: LowCodeModeler },
    { exact: true, id: 'L2-Solutions-Applications-Viewer', name: 'LowCodeViewer', path: '/solutions/:solutionId/forms/:formId', component: LowCodeViewer },
    { exact: true, id: 'L2-Solutions-Applications-Modeler', name: 'LowCodeViewer', path: '/solutions/:solutionId/forms/:formId/editor', component: LowCodeModeler },

    // Level 2 Routes for Environments
    { exact: true, id: 'L2-Environment-Dashboard', name: 'Dashboard', path: '/environments/:environmentId/dashboard', component: EnvironmentDashboard },

    // Level 2 Routes for XXX_MenuItem

];

export default routes;