import React, { useRef, useState } from "react";
import { getIP } from "../components/Tool";

export default function ProfileImageEdit({ open, onClose, memberNo, originUrl, onSuccess }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(originUrl);
  const [imgFile, setImgFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImgFile(file);
    }
  };

  const handleUpload = async () => {
    if (!imgFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", imgFile);
    const jwt = sessionStorage.getItem("jwt");
    const res = await fetch(
      `http://${getIP()}:9093/member/change-profileImage/${memberNo}`,
      {
        method: "POST",
        headers: { Authorization: jwt },
        body: formData,
      }
    );
    setLoading(false);
    if (res.ok) {
      const fileName = await res.text();
      alert("프로필 이미지가 변경되었습니다!");
      setImgFile(null);
    //   onClose();
      window.location.reload();
    } else {
      alert("변경 실패");
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[320px] flex flex-col items-center relative">
        <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="닫기"
        >×</button>
        <div className="mb-4 text-lg font-bold">프로필 이미지 변경</div>
        <img
          src={preview}
          alt="프로필 미리보기"
          className="rounded-full object-cover border-2 border-blue-300"
          style={{ width: 110, height: 110 }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={inputRef}
          onChange={handleChange}
        />
        <button
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
          onClick={() => inputRef.current?.click()}
        >이미지 선택</button>
        {imgFile && (
          <button
            className="mt-3 px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-white rounded transition"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "저장 중..." : "프로필 이미지 저장"}
          </button>
        )}
      </div>
    </div>
  );
}
