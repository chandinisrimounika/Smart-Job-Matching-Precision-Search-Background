import { useRef } from "react";

export default function ResumeUpload({ onParsed }) {
  const ref = useRef();
  return (
    <div className="upload">
      <input ref={ref} type="file" accept=".pdf,.docx" />
      <button onClick={() => ref.current?.files?.[0] && onParsed(ref.current.files[0])}>
        Parse Resume
      </button>
    </div>
  );
}