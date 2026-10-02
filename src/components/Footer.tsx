import { project } from "@/config/project";
import { httpUrl } from "@/lib/links";

export function Footer() {
  const x = httpUrl(project.xUrl);
  const trade = httpUrl(project.tradeUrl);
  const community = httpUrl(project.communityUrl);

  return (
    <footer className="border-t border-paper/10 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div>
          <p className="font-display text-2xl font-bold tracking-[-0.04em]">NOBRAIN</p>
          <p className="mt-2 text-sm text-paper/70">The world&apos;s least intelligent AI.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3 font-mono text-[0.68rem] tracking-[0.16em] text-paper/75">
          <FooterLink href={x ?? "#community"} external={Boolean(x)}>X</FooterLink>
          <FooterLink href={trade ?? "#token"} external={Boolean(trade)}>Trade</FooterLink>
          <FooterLink href="#token">Contract</FooterLink>
          <FooterLink href={community ?? "#community"} external={Boolean(community)}>Community</FooterLink>
          <FooterLink href="#disclaimer">Disclaimer</FooterLink>
        </nav>
        <p id="disclaimer" className="max-w-xl text-sm leading-relaxed text-paper/60">
          NOBRAIN is an internet meme/community project. Nothing on this website is financial advice or a promise of future value.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className="hover:text-paper"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
