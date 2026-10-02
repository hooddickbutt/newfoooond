import { Action } from "@/components/ui/action";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 pt-16 text-center">
      <div>
        <p className="font-mono text-[0.68rem] tracking-[0.28em] text-mute">404</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.05em]">PAGE NOT FOUND.</h1>
        <p className="mt-4 text-paper/70">This address is as empty as the original experiment.</p>
        <Action href="/" className="mt-8">
          BACK TO NOBRAIN
        </Action>
      </div>
    </main>
  );
}
