import React, { useRef, useState, useEffect } from "react";

// children: 보일 요소, className: 애니메이션용 클래스명, once: 한 번만 발동할지 여부
export function RevealOnScroll({ children, className = "", once = true }) {
  const ref = useRef();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          if (once && ref.current) obs.unobserve(ref.current);
        } else if (!once) {
          setShow(false);
        }
      },
      {
        threshold: 0.15, // 15%만 보여도 트리거
      }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12 pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
}
