import { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;
  threshold?: number;
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  once = true,
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [once, threshold]);

  const delayClass = delay ? `reveal-delay-${delay}` : "";
  return (
    // @ts-expect-error dynamic tag
    <Tag
      ref={ref}
      className={`reveal ${delayClass} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
