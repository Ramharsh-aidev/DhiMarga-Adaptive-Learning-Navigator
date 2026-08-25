import React, { useMemo } from "react";
import { motion } from "framer-motion";

export function FlipText({
  className,
  children,
  duration = 2.2,
  delay = 0,
  loop = true,
  separator = " ",
  together = false,
}) {
  const words = useMemo(() => children.split(separator), [children, separator]);
  const totalChars = children.length;

  const getCharIndex = (wordIndex, charIndex) => {
    let index = 0;
    for (let i = 0; i < wordIndex; i++) {
      index += words[i].length + (separator === " " ? 1 : separator.length);
    }
    return index + charIndex;
  };

  return (
    <div className={`inline-block leading-none ${className || ''}`} style={{ perspective: "1000px" }}>
      {words.map((word, wordIndex) => {
        const chars = word.split("");

        return (
          <span
            key={wordIndex}
            className="inline-block whitespace-nowrap"
            style={{ transformStyle: "preserve-3d" }}
          >
            {chars.map((char, charIndex) => {
              const currentGlobalIndex = getCharIndex(wordIndex, charIndex);

              let calculatedDelay = delay;
              if (!together) {
                const normalizedIndex = currentGlobalIndex / totalChars;
                const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
                calculatedDelay = sineValue * (duration * 0.25) + delay;
              }

              return (
                <motion.span
                  key={charIndex}
                  className="inline-block relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateX: [0, 360] }}
                  transition={{
                    duration: duration,
                    delay: calculatedDelay,
                    repeat: loop ? Infinity : 0,
                    ease: "easeInOut",
                    repeatDelay: 1,
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
            {separator === " " && wordIndex < words.length - 1 && (
              <span className="whitespace inline-block">&nbsp;</span>
            )}
            {separator !== " " && wordIndex < words.length - 1 && (
              <span className="separator inline-block">{separator}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default FlipText;
