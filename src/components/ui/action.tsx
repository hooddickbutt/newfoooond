import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tones = {
  solid:
    "h-12 rounded-none border border-paper bg-paper px-6 font-display text-[0.72rem] font-bold tracking-[0.16em] text-ink uppercase hover:border-signal hover:bg-signal hover:text-ink",
  line: "h-12 rounded-none border border-paper/35 bg-transparent px-6 font-display text-[0.72rem] font-bold tracking-[0.16em] text-paper uppercase hover:border-paper hover:bg-paper hover:text-ink",
  quiet:
    "h-11 rounded-none bg-transparent px-3 font-mono text-[0.72rem] tracking-[0.18em] text-paper/80 uppercase hover:bg-transparent hover:text-paper",
} as const;

type ActionProps = ComponentProps<typeof Button> & {
  tone?: keyof typeof tones;
  href?: string;
  external?: boolean;
};

export function Action({
  tone = "solid",
  href,
  external = false,
  className,
  children,
  ...props
}: ActionProps) {
  const classes = cn(tones[tone], "w-full sm:w-auto", className);

  if (href) {
    return (
      <Button
        nativeButton={false}
        data-cursor="button"
        className={classes}
        render={
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          />
        }
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button data-cursor="button" className={classes} {...props}>
      {children}
    </Button>
  );
}
