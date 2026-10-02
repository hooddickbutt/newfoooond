import type { ReactNode } from "react";

export function SectionHeading({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-10 max-w-3xl md:mb-14">
      <p className="font-mono text-[0.68rem] tracking-[0.28em] text-mute uppercase">
        {index}
      </p>
      <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.88] font-bold tracking-[-0.04em] text-paper uppercase">
        {title}
      </h2>
      {children ? (
        <div className="mt-5 max-w-xl text-base leading-relaxed text-paper/75 sm:text-lg">
          {children}
        </div>
      ) : null}
    </header>
  );
}
