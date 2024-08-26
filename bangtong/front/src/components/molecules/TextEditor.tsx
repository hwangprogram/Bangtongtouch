import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import imageCompression from "browser-image-compression";
import { FC } from "react";

interface CKEditorProps {
  data: string;
  onChange: (data: string) => void;
}

const TextEditor: FC<CKEditorProps> = ({ data, onChange }) => {
  return (
    <div className="editor-container">
      <CKEditor
        editor={ClassicEditor}
        data={data}
        config={{
          toolbar: [
            "heading",
            "|",
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "|",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "|",
            "imageUpload",
            "insertTable",
          ],
          extraPlugins: [MyCustomUploadAdapterPlugin],
        }}
        onFocus={() => {
          const logo = document.body.querySelectorAll(".ck-body-wrapper");
          if (logo.length > 0) {
            logo[0].remove();
          }
        }}
        onChange={(_event, editor) => {
          const logo = document.body.querySelectorAll(".ck-body-wrapper");
          if (logo.length > 0) {
            logo[0].remove();
          }
          const data = editor.getData();
          onChange(data);
        }}
      />
      <style>
        {`
        .ck-content ul,
        .ck-content ol {
          padding-left: 20px;
        }
        .ck-content {
          height: 450px;
        }
      `}
      </style>
    </div>
  );
};

function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return MyUploadAdapter(loader, editor);
  };
}

const MyUploadAdapter = (loader: any, editor: any) => {
  return {
    upload: async () => {
      const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]; // 허용된 파일 유형

      try {
        const file = await loader.file;
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error("Invalid file type.");
        }

        // 이미지 파일을 압축
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // 파일을 Base64로 변환
        const base64 = await toBase64(compressedFile);

        // CKEditor에 Base64 이미지 삽입
        const imgElement = `<img src='${base64}' alt='Image' />`;
        editor.model.change((writer: any) => {
          const viewFragment = editor.data.processor.toView(imgElement);
          const modelFragment = editor.data.toModel(viewFragment);
          editor.model.insertContent(
            modelFragment,
            editor.model.document.selection
          );
        });

        return {
          default: base64,
        };
      } catch (error) {
        throw error;
      }
    },
  };
};

// 파일을 Base64로 변환하는 함수
const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default TextEditor;
