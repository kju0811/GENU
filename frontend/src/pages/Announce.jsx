import React, { useState } from "react";
import { getIP } from "../components/Tool";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import ImageUpload from "../components/ImageUpload";

function Announce() {
    const jwt = sessionStorage.getItem('jwt');
    let userInfo = null;
    if (jwt != null) {
        try {
            userInfo = jwtDecode(jwt);
        } catch (err) {
            console.error("JWT 디코딩 오류:", err);
        }
    }

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [img, setImg] = useState(null);
    const navigate = useNavigate();

    const member_no = userInfo?.member_no;
    const role = userInfo?.role;

    const handleCreate = () => {
        if (role !== "ADMIN") {
            alert("관리자만 작성할 수 있습니다.");
            return;
        }

        if (title.trim() === '' || content.trim() === '') {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append(
            'announce',
            new Blob([
                JSON.stringify({
                    announcetitle: title,
                    announce_content: content,
                    member: { member_no }
                })
            ], { type: 'application/json' })
        );
        if (img) {
            formData.append('file', img);
        }

        fetch(`http://${getIP()}:9093/announce/create`, {
            method: 'POST',
            headers: { 'Authorization': jwt },
            body: formData
        })
            .then((response) => {
                if (response.ok) {
                    alert("공지사항이 생성되었습니다");
                    navigate('/announce_find');
                } else {
                    alert("공지사항 생성에 실패하였습니다");
                }
                return response.json();
            })
            .catch(() => alert("서버 오류가 발생했습니다."));
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">📢 공지사항 작성</h2>

                {/* 제목 입력 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="공지 제목을 입력하세요"
                    />
                </div>

                {/* 내용 입력 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-40 px-4 py-3 rounded-lg border-2 border-gray-300 resize-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="공지 내용을 입력하세요"
                    />
                </div>

                {/* 이미지 업로드 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">썸네일 이미지</label>
                    <ImageUpload value={img} onChange={setImg} label="이미지 선택" />
                </div>

                {/* 버튼 */}
                <div className="flex justify-end">
                    <button
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
                        onClick={handleCreate}
                    >
                        공지사항 등록
                    </button>
                </div>
            </div>
        </div>
    );

}

export default Announce;
