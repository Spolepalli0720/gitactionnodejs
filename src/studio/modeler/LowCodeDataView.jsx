import React, { Component } from "react";
import { Formio } from 'react-formio';

export default class LowCodeDataView extends Component {

    componentDidMount() {
        // const { formDesign, formDesignSource, formData,
        //     readOnly, renderMode, breadcrumbSettings, buttonSettings,
        //     onPrevPage, onNextPage, onChange, onSubmit, submitUrl} = this.props;


    }

    componentWillUnmount() {
        if (this.renderer !== undefined) {
            this.renderer.destroy(true);
        }
    }

    render() {
        return (
            <section className="studio-container">
                <div ref={element => this.element = element} />
            </section>
        );
    }

}

