import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BounceCardsProps {
  className?: string;
  images?: string[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
  onCardClick?: (idx: number) => void;
  confirmedIndices?: number[];
}

export default function BounceCards({
  className = "",
  images = [],
  containerWidth = 500,
  containerHeight = 300,
  animationDelay = 0.5,
  animationStagger = 0.15,
  easeType = "elastic.out(1, 0.5)",
  transformStyles = [
    "rotate(5deg) translate(-150px)",
    "rotate(0deg) translate(-70px)",
    "rotate(-5deg)",
  ],
  enableHover = true,
  onCardClick,
  confirmedIndices = [],
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".card",
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const getNoRotationTransform = (transformStr: string) => {
    if (/rotate\([\s\S]*?\)/.test(transformStr)) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
    }
    return transformStr === "none"
      ? "rotate(0deg)"
      : `${transformStr} rotate(0deg)`;
  };

  const getPushedTransform = (baseTransform: string, offsetX: number) => {
    const match = baseTransform.match(/translate\(([-0-9.]+)px\)/);
    if (match) {
      const newX = parseFloat(match[1]) + offsetX;
      return baseTransform.replace(
        /translate\(([-0-9.]+)px\)/,
        `translate(${newX}px)`,
      );
    }
    return baseTransform === "none"
      ? `translate(${offsetX}px)`
      : `${baseTransform} translate(${offsetX}px)`;
  };

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    images.forEach((_, i) => {
      const selector = q(`.card-${i}`);
      gsap.killTweensOf(selector);
      const base = transformStyles[i] || "none";
      if (i === hoveredIdx) {
        gsap.to(selector, {
          transform: getNoRotationTransform(base),
          duration: 0.4,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160;
        gsap.to(selector, {
          transform: getPushedTransform(base, offsetX),
          duration: 0.4,
          ease: "back.out(1.4)",
          delay: Math.abs(hoveredIdx - i) * 0.05,
          overwrite: "auto",
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    images.forEach((_, i) => {
      gsap.killTweensOf(q(`.card-${i}`));
      gsap.to(q(`.card-${i}`), {
        transform: transformStyles[i] || "none",
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
      ref={containerRef}>
      {images.map((src, idx) => {
        const isDone = confirmedIndices.includes(idx);
        return (
          <div
            key={idx}
            className={`card card-${idx} absolute w-[200px] aspect-square border-8 border-white rounded-[30px] overflow-hidden cursor-pointer transition-opacity ${isDone ? "opacity-40" : "opacity-100"}`}
            style={{
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              transform: transformStyles[idx] || "none",
            }}
            onMouseEnter={() => pushSiblings(idx)}
            onMouseLeave={resetSiblings}
            onClick={() => !isDone && onCardClick?.(idx)}>
            <img
              className="w-full h-full object-cover"
              src={src}
              alt={`card-${idx}`}
            />
            {isDone && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-white text-4xl font-black">✓</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
