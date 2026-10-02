"use client";

import { useEffect, useState } from "react";
import { BrainSvg } from "@/components/character/BrainSvg";
import { SectionHeading } from "@/components/SectionHeading";
import { Action } from "@/components/ui/action";
import { project } from "@/config/project";
import type { DemoMeme } from "@/data/community";
import { decisionFor } from "@/lib/decisions";
import { fetchCommunity } from "@/lib/community";
import { httpUrl } from "@/lib/links";
import { openXShare } from "@/lib/share";
import { playSound } from "@/lib/sound";

const still = {
  pupil: { x: 0, y: 0 },
  blink: 0,
  glitch: false,
  phase: 0.4,
};

export function Community() {
  const [posts, setPosts] = useState<DemoMeme[] | null>(null);
  const [source, setSource] = useState<"demo" | "remote" | "error">("demo");
  const x = httpUrl(project.xUrl);
  const community = httpUrl(project.communityUrl);
  const today = decisionFor(new Date());

  useEffect(() => {
    let cancel = false;
    fetchCommunity()
      .then((payload) => {
        if (cancel) return;
        setPosts(payload.posts);
        setSource(payload.source);
      })
      .catch(() => {
        if (!cancel) setSource("error");
      });
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <section id="community" className="scroll-mt-20 border-t border-paper/10 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="10  /  PEOPLE" title="The brainless community">
          {source === "remote"
            ? "Posts from the connected community source."
            : "Sample layouts for the gallery. These are not visitor submissions."}
        </SectionHeading>

        <article data-cursor="card" className="grid gap-6 border border-paper/15 p-5 sm:p-8 lg:grid-cols-[280px_1fr] lg:items-center">
          <BrainSvg
            state={{ ...still, expression: "confused" }}
            className="mx-auto h-56 w-auto"
          />
          <div>
            <p className="font-mono text-[0.66rem] tracking-[0.2em] text-signal">FEATURED · SAMPLE DATA</p>
            <h3 className="mt-3 font-display text-3xl leading-[0.95] font-bold tracking-[-0.04em] uppercase sm:text-5xl">
              {today.decision}
            </h3>
            <p className="mt-4 font-mono text-sm text-paper/75">{today.reaction}</p>
            <Action
              tone="quiet"
              className="mt-4 w-auto px-0"
              onClick={() => {
                playSound("click");
                openXShare(`NOBRAIN today: "${today.decision}"`);
              }}
            >
              POST THIS
            </Action>
          </div>
        </article>

        {source === "error" ? (
          <p className="mt-6 font-mono text-sm text-paper" role="alert">
            The gallery could not be loaded.
          </p>
        ) : null}

        {posts === null && source !== "error" ? (
          <p className="mt-6 font-mono text-sm text-mute">LOADING SAMPLE GALLERY...</p>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(posts ?? []).map((post) => (
            <article key={post.id} data-cursor="card" className="border border-paper/15 p-4">
              <div className="flex items-start justify-between gap-3">
                <BrainSvg
                  state={{ ...still, expression: post.expression, glitch: post.expression === "glitch" }}
                  className="h-28 w-auto"
                />
                <span className="border border-paper/25 px-1.5 py-0.5 font-mono text-[0.58rem] tracking-[0.14em] text-mute">
                  {post.demo ? "DEMO" : "LIVE"}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl leading-none font-bold tracking-[-0.03em] uppercase">
                {post.top}
              </h3>
              <p className="mt-2 font-mono text-xs text-paper/70">{post.bottom}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="border border-paper/15 p-5">
            <p className="font-mono text-[0.66rem] tracking-[0.2em] text-mute">X POSTS</p>
            <p className="mt-4 font-display text-3xl leading-none font-bold tracking-[-0.04em] uppercase">
              No live feed
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/70">
              Posts appear here when an X API is connected. This panel does not invent tweets.
            </p>
            <Action tone="line" className="mt-6" href={x ?? "#community"} external={Boolean(x)}>
              {x ? "OPEN X" : "X NOT CONFIGURED"}
            </Action>
          </div>
          <div className="border border-paper/15 p-5">
            <p className="font-mono text-[0.66rem] tracking-[0.2em] text-mute">LINKS</p>
            <ul className="mt-4 space-y-3 font-mono text-sm">
              <li>
                <a className="hover:text-signal" href={x ?? "#community"} {...(x ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  X {x ? "" : "— not configured"}
                </a>
              </li>
              <li>
                <a className="hover:text-signal" href={community ?? "#community"} {...(community ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  Community {community ? "" : "— not configured"}
                </a>
              </li>
              <li>
                <a className="hover:text-signal" href="#lab">
                  Make a meme
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
