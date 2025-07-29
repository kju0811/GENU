import React, { useEffect, useState } from "react";
import { getIP } from "../components/Tool";
import { useParams, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

function Announce_read() {
  const [data, setData] = useState(null);
  const [update, setUpdate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState(null);
  const { announce_no } = useParams();
  const jwt = sessionStorage.getItem("jwt");
  const navigate = useNavigate();

  let userInfo = null;
  if (jwt) {
    try {
      userInfo = jwtDecode(jwt);
    } catch (err) {
      console.error("JWT 디코딩 오류:", err);
    }
  }

  const role = userInfo?.role;

  const fetchAnnounce = () => {
    fetch(`http://${getIP()}:9093/announce/read/${announce_no}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setTitle(result.announcetitle);
        setContent(result.announce_content);
        setImg(result.file);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAnnounce();
  }, [announce_no]);

  const deleteAnnounce = () => {
    if (window.confirm("공지사항을 삭제하시겠습니까?") && role === "ADMIN") {
      fetch(`http://${getIP()}:9093/announce/delete/${announce_no}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
      }).then((response) => {
        if (response.ok) {
          alert("공지사항을 삭제했습니다");
          navigate(-1);
        } else {
          alert("삭제에 실패하였습니다");
        }
      });
    }
  };

  const formData = new FormData();
  formData.append(
    "announce",
    new Blob(
      [
        JSON.stringify({
          announcetitle: title,
          announce_content: content,
        }),
      ],
      { type: "application/json" }
    )
  );
  if (img) {
    formData.append("file", img);
  }

  const updateAnnounce = () => {
    fetch(`http://${getIP()}:9093/announce/update/${announce_no}`, {
      method: "PUT",
      headers: {
        Authorization: jwt,
      },
      body: formData,
    }).then((response) => {
      if (response.ok) {
        alert("공지사항을 수정했습니다");
        setUpdate(false);
        fetchAnnounce();
      } else {
        alert("수정에 실패하였습니다");
      }
    });
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400 select-none">
        로딩 중...
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg my-12 transition-colors duration-300">
      {/* 이미지 */}
      {img && (
        <div className="flex justify-center mb-8">
          <img
            src={`http://${getIP()}:9093/home/storage/${img}`}
            alt="공지 이미지"
            className="max-h-96 rounded-md object-contain shadow-md"
          />
        </div>
      )}

      {/* 수정 모드 */}
      {update ? (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            updateAnnounce();
          }}
        >
          <label className="block">
            <span className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              제목
            </span>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
              required
              className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none transition"
            />
          </label>

          <label className="block">
            <span className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              본문
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required
              className="w-full px-4 py-3 border rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none transition"
            />
          </label>

          <label className="block">
            <span className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              이미지 업로드
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:cursor-pointer file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:rounded-md file:text-blue-700 hover:file:bg-blue-200 dark:file:bg-blue-900 dark:file:text-blue-400"
            />
            {img && (
              <p className="mt-2 text-green-600 dark:text-green-400 truncate">
                {img.name} 선택됨
              </p>
            )}
          </label>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              수정 완료
            </button>
            <button
              type="button"
              onClick={() => setUpdate(false)}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition"
            >
              수정 취소
            </button>
          </div>
        </form>
      ) : (
        // 읽기 모드
        <article className="prose prose-lg dark:prose-invert max-w-none text-center">
          <h1 className="mb-2 font-extrabold text-gray-900 dark:text-white">{title}</h1>
          <time
            dateTime={data.announcedate}
            className="block mb-6 text-sm text-gray-500 dark:text-gray-400"
          >
            {new Date(data.announcedate).toLocaleString()}
          </time>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{content}</p>

          <button
            onClick={() => navigate(-1)}
            className="mt-8 inline-block px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition"
            aria-label="이전 페이지로 돌아가기"
          >
            이전으로
          </button>
        </article>
      )}

      {/* 관리자 버튼 */}
      {role === "ADMIN" && !update && (
        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={deleteAnnounce}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            aria-label="공지사항 삭제"
          >
            삭제하기
          </button>
          <button
            onClick={() => setUpdate(true)}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg transition"
            aria-label="공지사항 수정"
          >
            수정하기
          </button>
        </div>
      )}
    </section>
  );
}

export default Announce_read;
