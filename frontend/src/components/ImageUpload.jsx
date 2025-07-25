import React, { useRef, useState, useEffect } from "react";

export default function ImageUpload({
  value,        // File 객체(새 파일) 또는 null
  onChange,     // 파일 변경 콜백
  originUrl,    // 기존(등록된) 이미지 URL
  previewSize = 96,
  label = "이미지 업로드",
  accept = "image/*"
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // 새 파일 or 기존 이미지 우선순위 프리뷰
  useEffect(() => {
    if (value) setPreview(URL.createObjectURL(value));
    else if (originUrl) setPreview(originUrl);
    else setPreview(null);

    return () => {
      // File 객체 해제
      if (preview && value) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line
  }, [value, originUrl]);

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    onChange && onChange(file);
    // 미리보기는 위의 useEffect가 자동처리
  };

  const handleBtnClick = () => inputRef.current?.click();

  // 제거 = 파일/프리뷰 리셋 (기존이미지까지 리셋할지는 부모가 결정)
  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    inputRef.current.value = null;
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="relative">
        <div
          className="flex items-center justify-center rounded-full border-2 border-indigo-300 bg-gray-50 overflow-hidden"
          style={{ width: previewSize, height: previewSize }}
        >
          {preview
            ? <img src={preview} alt="미리보기" className="object-cover w-full h-full" />
            : <span className="text-gray-300 text-3xl">+</span>
          }
        </div>
        {preview && (
          <button
            type="button"
            className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full text-gray-500 border border-gray-300 hover:bg-red-50 hover:text-red-600 transition w-7 h-7 flex items-center justify-center"
            title="제거"
            onClick={handleRemove}
          >×</button>
        )}
      </div>
      <input
        type="file"
        accept={accept}
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="mt-1 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-semibold"
        onClick={handleBtnClick}
      >
        {label}
      </button>
    </div>
  );
}
