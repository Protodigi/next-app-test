"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const AnimatedTitle = ({ title }: { title: string }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let timeline: gsap.core.Timeline | null = null;
    if (titleRef.current) {
      const letters = Array.from(titleRef.current.children);
      timeline = gsap.timeline();

      timeline
        .fromTo(
          letters,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power3.out" }
        )
        .to(letters, { color: "#a78bfa", stagger: 0.05, duration: 0.2 })
        .to(letters, { color: "#8b5cf6", stagger: 0.05, duration: 0.2 })
        .to(letters, { color: "#7c3aed", stagger: 0.05, duration: 0.2 })
        .to(letters, { color: "#6d28d9", stagger: 0.05, duration: 0.2 })
        .to(letters, { color: "#5b21b6", stagger: 0.05, duration: 0.2 })
        .to(letters, { color: "#ffffff", stagger: 0.05, duration: 0.2 });
    }

    return () => {
      if (timeline) {
        timeline.kill();
      }
    };
  }, []);

  return (
    <h1 ref={titleRef} className="text-4xl font-bold tracking-tighter">
      {title.split("").map((letter, index) => (
        <span key={index} style={{ display: "inline-block" }}>
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </h1>
  );
};

export default AnimatedTitle;
