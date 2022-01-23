import React, { useState } from "react";

// ckeditor 5
import { CKEditor } from '@ckeditor/ckeditor5-react';
// integrated from online builder
import InlineEditor from 'ckeditor5-custom-build/build/ckeditor';


function TextEditor(props) {
    // ckeditor config
    // text
    const textConfig = { isHeading: true, toolbar: ["bold","italic","underline","undo","redo"] };
    // rte
    const rteConfig = {
        toolbar: ["bold","italic","underline","link","|","fontSize","alignment","bulletedList","numberedList","blockQuote","|","imageUpload","insertTable","undo","redo"],
        image: {
            resizeUnit:"px",
            toolbar: ["imageTextAlternative","imageStyle:alignLeft","imageStyle:alignRight"],
            styles: ["full","alignLeft","alignRight"]
        },
        ckfinder: {
            uploadUrl: "/__xpr__/pub_engine/business-admin/element/file_uploader",
            options: {
                resourceType: 'Images'
            }
        }
    };

    return (
        <>
            <CKEditor
                editor={ InlineEditor }
                config={ props.rte ? rteConfig : textConfig }
                data={props.value}
                onReady={ editor => {
                    // handle html output for headings
                    if (!props.rte) editor.model.schema.extend("paragraph", {isLimit: true});
                    // check if the changes lead to an empty root in the editor
                    editor.model.document.registerPostFixer( writer => {
                        const changes = editor.model.document.differ.getChanges();
                        for (const entry of changes) {
                            if (entry.type == "remove" && entry.position.root.isEmpty) {
                                // insert string if root is empty to prevent model-nodelist-offset-out-of-bounds error
                                writer.insertText(" ", entry.position.root, "end");
                                return true;
                            }
                        }
                    });
                } }
                onBlur={ ( event, editor ) => {
                    const data = editor.getData();
                    props.updateData(props.name,data);
                } }
            />
        </>
    );
}

export default TextEditor;