import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TextEditor({value, onChange}) {
    const editorRef = useRef(null);
    return (
        <>
            <Editor
                apiKey='yt2rl2ly7xbg83giohyz28tryp3fsrybshvh74i4l3rd7dd2'
                onInit={(_evt, editor) => editorRef.current = editor}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={(content) => onChange(content)}
                value={value}
            />
        </>
    );
}
