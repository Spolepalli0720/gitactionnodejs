import React from "react";

import { userService } from "../services/UserService";

class SignOut extends React.Component {

    componentDidMount() {
        userService.forgetMe();
        window.location.replace("/");
    }

    render() {
        return (
            <section className="studio-container"></section>
        )
    }
}
export default SignOut;