import { useRef, useState } from "react";

/**
 * Owns everything about the uploaded file: validation, drag state and the
 * selected File itself. Keeps App.jsx about layout and results.
 */
export default function useResumeUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  function chooseFile(candidate) {
    if (!candidate) return;
    const isPdf = candidate.type === "application/pdf" || /\.pdf$/i.test(candidate.name);
    if (!isPdf) {
      setError(`"${candidate.name}" isn't a PDF. Export your resume as PDF and try again.`);
      return;
    }
    setError("");
    setFile(candidate);
  }

  function clear() {
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const dragProps = {
    onDragEnter: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragOver: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: (e) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDrop: (e) => {
      e.preventDefault();
      setIsDragging(false);
      chooseFile(e.dataTransfer.files[0]);
    }
  };

  return { file, error, setError, isDragging, inputRef, chooseFile, clear, dragProps };
}
