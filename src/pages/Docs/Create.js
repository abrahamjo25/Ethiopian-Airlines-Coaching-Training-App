import React, { useState } from "react";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { BASE_COLOR } from "../../services/Settings";
import { useHistory, useLocation } from "react-router-dom";
import { postData, putData } from "../../services/AccessAPI";
const CreateDocs = () => {
    const location = useLocation();
    let emptyResult = {
        id: location.state?.data.id || 0,
        title: location.state?.data.title || "",
        content: location.state?.data.content || "<h4>Write content!</h4><div>Corporate <b>Coaching</b> Docs</div><div><br></div>",
    };
    const [result, setResult] = useState(emptyResult);
    const [waiting, setWaiting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const history = useHistory();
    const onTitleChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _result = { ...result };
        _result[`${name}`] = val;
        setResult(_result);
    };
    const onInputChange = (text) => {
        let _result = { ...result };
        _result["content"] = text.htmlValue;
        setResult(_result);
    };
    const saveResult = async () => {
        setSubmitted(true);
        if (result.title && result.content) {
            let _result = { ...result };
            if (result?.id != 0) {
                setWaiting(true);
                setSubmitted(false);
                await putData(`/Documentation/Update`, _result, "Documentation-Create");
                setResult(emptyResult);
                setWaiting(false);
            } else {
                setSubmitted(false);
                setWaiting(true);
                await postData(`/Documentation/Create`, _result, "Documentation-Create");
                setWaiting(false);
            }
            history.push("/documentation");
        }
    };

    const cancleCreate = () => {
        setResult(emptyResult);
        history.push("/documentation");
    };
    return (
        <div className="surface-ground py-3 md:px-8 lg:px-8">
            <div style={{ display: "block", width: "100%", padding: 30 }}>
                <div className="">
                    <h4 className="text-center">Create User guids</h4>
                    <h5>Title</h5>
                    <InputText value={result?.title} onChange={(e) => onTitleChange(e, "title")} placeholder="Write title" />
                    {submitted && !result.title && <small className="p-invalid text-danger">Title is required.</small>}
                    <h5>Content</h5>
                    <Editor style={{ height: "320px" }} value={result?.content} onTextChange={(e) => onInputChange(e)} />
                    {submitted && !result.content && <small className="p-invalid text-danger">Content is required.</small>}
                </div>
            </div>
            <>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text btn-success" onClick={cancleCreate} />
                {waiting ? <Button label="Saving" icon="pi pi-spin pi-spinner" style={{ backgroundColor: BASE_COLOR }} disabled={true} /> : <Button label="Save" icon="pi pi-save" style={{ backgroundColor: BASE_COLOR }} className="btn-danger" onClick={saveResult} />}
            </>
        </div>
    );
};

export default CreateDocs;
