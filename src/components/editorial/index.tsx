"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

/** Small uppercase mono label with the "+" index mark. */
export function Eyebrow({ children, className = "", plus = true }: { children: React.ReactNode; className?: string; plus?: boolean }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.18em] text-muted-on-green flex items-center gap-3 ${className}`}>
      {plus && <span className="text-accent-gold text-sm leading-none" aria-hidden="true">+</span>}
      <span>{children}</span>
    </p>
  );
}

/** Editorial section heading: mono eyebrow, serif title with an italic second line, short lede. */
export function SectionHeading({
  eyebrow,
  title,
  italic,
  lede,
  id,
  align = "start",
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  italic?: React.ReactNode;
  lede?: React.ReactNode;
  id?: string;
  align?: "start" | "center";
}) {
  return (
    <header className={`mb-12 sm:mb-16 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow>
      <h2 id={id} className="font-display text-4xl sm:text-5xl lg:text-6xl text-brand-cream leading-[1.04] tracking-tight mt-5">
        {title}
        {italic && (
          <>
            {" "}
            <em className="block font-display italic font-normal text-accent-gold/90">{italic}</em>
          </>
        )}
      </h2>
      {lede && <p className="mt-6 text-[15px] leading-relaxed text-muted-on-green max-w-xl">{lede}</p>}
    </header>
  );
}

type Common = { variant?: "line" | "solid"; icon?: React.ReactNode; className?: string; children?: React.ReactNode };
type LinkProps = Common & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { as?: "a" };
type BtnProps = Common & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { as: "button" };

/** Square, hairline-bordered action with a mono label and an arrow (the site's primary button). */
export const LineButton = React.forwardRef<HTMLAnchorElement & HTMLButtonElement, LinkProps | BtnProps>(function LineButton(props, ref) {
  const { variant = "line", icon, children, className = "", as, ...rest } = props;
  const cls = `group inline-flex items-center justify-between gap-6 min-h-[52px] px-5 font-mono text-[12px] uppercase tracking-[0.16em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold ${
    variant === "solid"
      ? "bg-brand-cream text-brand-green hover:bg-white"
      : "border border-accent-gold/60 text-brand-cream hover:bg-brand-cream/5 hover:border-accent-gold"
  } ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {icon ?? <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />}
    </>
  );
  if (as === "button") {
    return (
      <button ref={ref} type="button" className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {inner}
      </button>
    );
  }
  return (
    <a ref={ref} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {inner}
    </a>
  );
});

/** Thin divider. */
export const Rule = ({ className = "" }: { className?: string }) => <hr className={`border-0 h-px bg-brand-cream/10 ${className}`} />;
