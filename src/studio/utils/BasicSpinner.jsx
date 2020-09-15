import React from "react";
// import { Card } from "react-bootstrap";

export const BasicSpinner = () => {
    const spinnerVariants = [
        // "primary",
        // "secondary",
        // "success",
        "danger"
        // "warning",
        // "info",
        // "light",
        // "dark"
    ];
    const basicSpinnerBorder = spinnerVariants.map((variant, idx) => (
        <div
            key={idx}
            className={["spinner-border", "mr-1", "text-" + variant].join(" ")}
            role="status">
            <span className="sr-only">Loading...</span>
        </div>
    ));
    return (
        <div className="loader-position text-center bg-white">
            <span className="text-center">{basicSpinnerBorder}</span>
        </div>
    );
};
