import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram, Facebook, Mail, Disc } from "lucide-react";

const defaultItems = [
  { letter: "G", icon: <Github size={20} />, label: "Github", href: "#" },
  { letter: "T", icon: <Twitter size={20} />, label: "Twitter", href: "#" },
  { letter: "L", icon: <Linkedin size={20} />, label: "LinkedIn", href: "#" },
  { letter: "I", icon: <Instagram size={20} />, label: "Instagram", href: "#" },
  { letter: "F", icon: <Facebook size={20} />, label: "Facebook", href: "#" },
  { letter: "M", icon: <Mail size={20} />, label: "Email", href: "#" },
  { letter: "D", icon: <Disc size={20} />, label: "Discord", href: "#" },
];

const SocialFlipNode = ({
  item,
  index,
  isHovered,
  setTooltipIndex,
  tooltipIndex,
}) => {
  const Wrapper = item.href ? "a" : "div";
  const wrapperProps = item.href
    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
    : { onClick: item.onClick };

  return (
    <Wrapper
      {...wrapperProps}
      className="relative h-12 w-12 cursor-pointer"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setTooltipIndex(index)}
      onMouseLeave={() => setTooltipIndex(null)}
    >
      <AnimatePresence>
        {isHovered && tooltipIndex === index && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8, x: "-50%" }}
            animate={{ opacity: 1, y: -50, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 10, scale: 0.8, x: "-50%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 z-50 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-xl"
          >
            {item.label}
            {/* Arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 120,
          damping: 15,
          delay: index * 0.08,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Letter */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-800 text-xl font-bold text-slate-200 shadow-sm border border-slate-700"
          style={{ backfaceVisibility: "hidden" }}
        >
          {item.letter}
        </div>

        {/* Back - Icon */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-pink-600 text-xl text-white shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {item.icon}
        </div>
      </motion.div>
    </Wrapper>
  );
};

export default function SocialFlipButton({ items = defaultItems }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState(null);

  return (
    <div className="flex flex-col items-start gap-4">
      <div
        className="group relative flex items-center justify-center gap-2 rounded-3xl bg-slate-900 p-4 shadow-sm border border-slate-700/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setTooltipIndex(null);
        }}
      >
        {/* Border Lines Container - Clipped */}
        <div className="absolute -inset-[1px] overflow-hidden rounded-3xl pointer-events-none">
          {/* Animated Top Border Line */}
          <motion.div
            className="absolute top-0 left-0 h-[1px] w-full bg-linear-to-r from-transparent via-violet-500/50 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Animated Bottom Border Line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] w-full bg-linear-to-r from-transparent via-pink-500/50 to-transparent"
            animate={{ x: ["100%", "-100%"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {items.map((item, index) => (
          <SocialFlipNode
            key={index}
            item={item}
            index={index}
            isHovered={isHovered}
            setTooltipIndex={setTooltipIndex}
            tooltipIndex={tooltipIndex}
          />
        ))}
      </div>
    </div>
  );
}
