import React, { Component } from "react";
import { Captcha } from "primereact/captcha";
import { Toast } from "primereact/toast";

export class MyCaptcha extends Component {
    constructor(props) {
        super(props);
        this.showResponse = this.showResponse.bind(this);
    }

    showResponse() {
        this.toast.show({ severity: "info", summary: "Success", detail: "User Responded" });
    }

    render() {
        return (
            <div>
                <Toast ref={(el) => (this.toast = el)}></Toast>

                <div className="card">
                    <Captcha siteKey="6Le1VdkkAAAAANTDE4k6gV1_saN43DtoTjTo65w3" onResponse={this.showResponse} />
                </div>
            </div>
        );
    }
}
