"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { CustomCursor } from "@/components/CustomCursor";

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="atmosphere" aria-hidden="true" />
      <div className="glitch-flash" aria-hidden="true" />
      <CustomCursor />
      {children}
    </MotionConfig>
  );
}
