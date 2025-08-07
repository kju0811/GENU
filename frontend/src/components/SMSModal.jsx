import React, { useEffect, useRef } from 'react';

export default function SMSModal({ open, onClose }) {
    const modalRef = useRef(null);

    // 외부 클릭 감지
    useEffect(() => {
        const handler = e => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
            <div ref={modalRef} className="bg-white w-full max-w-[500px] rounded-xl shadow-lg p-6 space-y-4 relative">
                <h2 className="font-bold text-lg mb-2 text-indigo-600">[가격 알림 SMS 수신 동의 안내]</h2>
                <div className="text-gray-700 text-sm whitespace-pre-line">
                    저희 제누(GENU)는 가격 알림 정보를 문자(SMS)를 통해 안내드리고 있습니다. 이에 따라, 귀하의 휴대전화번호로 관련 문자 메시지를 발송할 수 있습니다.

                    문자 수신에 동의하실 경우, 항목에 동의해주시기 바랍니다.

                    ※ 본 동의는 가격 알림 목적의 문자 전송에 한하며, 언제든 수신 거부가 가능합니다.

                    ※ 본인 전화번호가 아닐 시 문자 전송에 오류가 발생할 수 있습니다.
                </div>
                <button
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded w-full hover:bg-indigo-700 transition"
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>
        </div>
    );
}
