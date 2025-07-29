import React, { useEffect, useState } from "react";
import { getIP } from "../components/Tool";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function MemberUpdate({ }) {
    const { member_no } = useOutletContext(); // MyPage에서 Outlet context로 넘긴 값 받기
    const navigate = useNavigate();

    // 상태 (아이디도 수정 가능)
    const [memberId, setMemberId] = useState("");
    const [memberName, setMemberName] = useState("");
    const [memberNick, setMemberNick] = useState("");
    const [memberTel, setMemberTel] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");

    const [loading, setLoading] = useState(false);

    // 초기 데이터 로드 (기존 값 셋팅)
    useEffect(() => {
        if (!member_no) return;

        fetch(`http://${getIP()}:9093/member/read/${member_no}`)
            .then((res) => {
                if (!res.ok) throw new Error("회원 정보를 불러오는데 실패했습니다.");
                return res.json();
            })
            .then((data) => {
                setMemberId(data.memberId || "");
                setMemberName(data.member_name || "");
                setMemberNick(data.member_nick || "");
                setMemberTel(data.member_tel || "");
                setZipcode(data.zipcode || "");
                setAddress1(data.address1 || "");
                setAddress2(data.address2 || "");
            })
            .catch((err) => {
                alert(err.message);
            });
    }, [member_no]);

    // 저장 처리 (아이디도 포함)
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const updatedMember = {
            memberId, // 아이디도 수정 가능하도록 포함
            member_name: memberName,
            member_nick: memberNick,
            member_tel: memberTel,
            zipcode,
            address1,
            address2,
        };

        try {
            const res = await fetch(`http://${getIP()}:9093/member/${member_no}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedMember),
            });

            if (!res.ok) {
                throw new Error(`수정 실패: ${res.status}`);
            }

            alert("회원 정보가 성공적으로 수정되었습니다.");
            navigate(`/mypage/portfolio`);
            window.location.reload();
        } catch (error) {
            alert(error.message || "오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">회원 정보 수정</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 아이디 (수정 가능) */}
                <div>
                    <label className="block mb-1 font-medium">아이디</label>
                    <input
                        type="text"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* 이름 */}
                <div>
                    <label className="block mb-1 font-medium">이름</label>
                    <input
                        type="text"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* 닉네임 */}
                <div>
                    <label className="block mb-1 font-medium">닉네임</label>
                    <input
                        type="text"
                        value={memberNick}
                        onChange={(e) => setMemberNick(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* 전화번호 */}
                <div>
                    <label className="block mb-1 font-medium">전화번호</label>
                    <input
                        type="tel"
                        value={memberTel}
                        onChange={(e) => setMemberTel(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="예: 010-1234-5678"
                    />
                </div>

                {/* 우편번호 */}
                <div>
                    <label className="block mb-1 font-medium">우편번호</label>
                    <input
                        type="text"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* 주소1 */}
                <div>
                    <label className="block mb-1 font-medium">주소 1</label>
                    <input
                        type="text"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* 주소2 */}
                <div>
                    <label className="block mb-1 font-medium">주소 2</label>
                    <input
                        type="text"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "저장 중..." : "저장"}
                    </button>
                </div>
            </form>
        </div>
    );
}
