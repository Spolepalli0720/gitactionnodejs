import React, { Component, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
// import Loadable from 'react-loadable';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";
import Login from "../studio/login/Login";

import { ensureMessagingPermission } from '../firebase-messaging';
import { userService } from '../studio/services/UserService'

// STUDIO_CUSTOMIZATION
// const AdminLayout = Loadable({
//     loader: () => import('./layout/AdminLayout'),
//     loading: Loader
// });
import AdminLayout from './layout/AdminLayout';

class App extends Component {

    componentDidMount() {
        // STUDIO_CUSTOMIZATION   
        if (userService.isAuthenticated()) {
            ensureMessagingPermission();
        }
    }

    render() {
        // STUDIO_CUSTOMIZATION
        // const menu = routes.map((route, index) => {
        //   return (route.component) ? (
        //       <Route
        //           key={index}
        //           path={route.path}
        //           exact={route.exact}
        //           name={route.name}
        //           render={props => (
        //               <route.component {...props} />
        //           )} />
        //   ) : (null); 
        // });
        const menu = routes.map((route, index) => {
            return (route.component) ? (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        <route.component {...props} />
                    )} />
            ) : (<Route path="/login" key={index} exact={true} component={Login} />);
        });

        return (
            <Aux>
                <ScrollToTop>
                    <Suspense fallback={<Loader />}>
                        <Switch>
                            {menu}
                            <Route path="/" component={AdminLayout} />
                        </Switch>
                    </Suspense>
                </ScrollToTop>
            </Aux>
        );
    }
}

export default App;
