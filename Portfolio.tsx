import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useInView,
} from "framer-motion";

/* ---------------- Data ---------------- */

const NAV = [
  { label: "Trabajo", href: "#work" },
  { label: "Sobre mí", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Contacto", href: "#contact" },
];

const PROJECTS = [
  {
    year: "2025",
    name: "Helix Analytics",
    role: "Lead Frontend",
    stack: ["React", "TypeScript", "WebGL", "tRPC"],
    blurb:
      "Plataforma de analítica en tiempo real. Reescribí el pipeline de rendering y bajé el TTI de 4.2s a 780ms.",
    accent: "oklch(0.88 0.19 125)",
  },
  {
    year: "2024",
    name: "Norte Payments",
    role: "Full-stack Engineer",
    stack: ["Next.js", "Postgres", "Stripe", "Redis"],
    blurb:
      "Sistema de pagos multi-moneda para LatAm. Procesamos $12M en el primer trimestre sin downtime.",
    accent: "oklch(0.78 0.18 40)",
  },
  {
    year: "2024",
    name: "Cadence DAW",
    role: "Creator",
    stack: ["Web Audio", "Rust WASM", "Canvas"],
    blurb:
      "Estación de audio digital en el navegador con latencia sub-10ms. Side-project que llegó a 4k usuarios.",
    accent: "oklch(0.7 0.2 280)",
  },
  {
    year: "2023",
    name: "Kestrel CMS",
    role: "Founding Engineer",
    stack: ["Remix", "Prisma", "S3", "Edge"],
    blurb:
      "CMS headless para redacciones. Diseñé el modelo de contenido y el editor colaborativo en tiempo real.",
    accent: "oklch(0.75 0.17 210)",
  },
];

const STACK = [
  { group: "Lenguajes", items: ["TypeScript", "Go", "Rust", "Python", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "TanStack", "Motion", "Tailwind"] },
  { group: "Backend", items: ["Node", "Postgres", "Redis", "gRPC", "Kafka"] },
  { group: "Infra", items: ["AWS", "Cloudflare", "Docker", "Terraform", "GitHub Actions"] },
];

const EXPERIENCE = [
  {
    period: "2023 — Hoy",
    company: "Helix Labs",
    role: "Senior Software Engineer",
    detail: "Liderando el equipo de plataforma. 4 ingenieros a cargo. Product-minded.",
  },
  {
    period: "2021 — 2023",
    company: "Norte Fintech",
    role: "Full-stack Engineer",
    detail: "Sistemas de pagos, ledger, integraciones bancarias. On-call rotation.",
  },
  {
    period: "2019 — 2021",
    company: "Freelance",
    role: "Software Consultant",
    detail: "Producto para startups en seed / Series A. 11 proyectos entregados.",
  },
];

/* ---------------- Helpers ---------------- */

function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLElement | null>(null);
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, x, y]);

  return { ref, x, y };
}

/* ---------------- Cursor ---------------- */

function CustomCursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 400, damping: 40 });
  const y = useSpring(my, { stiffness: 400, damping: 40 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-cursor='hover']"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [mx, my]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{ x, y }}
    >
      <motion.div
        animate={{ scale: hover ? 2.2 : 1, opacity: hover ? 0.4 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ width: 12, height: 12 }}
      />
    </motion.div>
  );
}

/* ---------------- Nav ---------------- */

function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => scrollY.on("change", (v) => setScrolled(v > 40)), [scrollY]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-background/60 border-b border-border/60" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-foreground">luciano.caraballo</span>
          <span className="text-muted-foreground">/ engineer</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary group-hover:bg-primary-foreground" />
          Disponible
        </a>
      </div>
    </motion.header>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = ["interfaces", "sistemas", "productos", "detalles"];
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="top"
      ref={containerRef}
      className="grain relative flex min-h-screen items-center overflow-hidden px-6 pt-32"
    >
      {/* grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />
      {/* orb */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-10%] top-1/3 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
      />

      <motion.div style={{ y, opacity }} className="relative mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-border bg-surface/50 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Paysandú, Uruguay · UTC-3
        </motion.div>

        <h1 className="font-display text-balance text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-tight">
          <RevealLine delay={0.1}>Construyo</RevealLine>
          <RevealLine delay={0.25}>
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.em
                  key={words[wordIdx]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block italic text-primary"
                >
                  {words[wordIdx]}
                </motion.em>
              </AnimatePresence>
            </span>{" "}
            <span className="text-muted-foreground">que</span>
          </RevealLine>
          <RevealLine delay={0.4}>se sienten inevitables.</RevealLine>
        </h1>

        <div className="mt-12 grid grid-cols-1 items-end gap-8 md:grid-cols-3">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="col-span-1 max-w-md text-base text-muted-foreground md:col-span-2"
          >
            Soy <span className="text-foreground">Luciano Caraballo</span>, ingeniero de software con 6+
            años construyendo productos. Del pixel al pipeline: React, TypeScript, sistemas
            distribuidos y esa obsesión con los detalles que hace la diferencia.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-end"
          >
            <MagneticButton href="#work">
              Ver trabajo <Arrow />
            </MagneticButton>
            <a
              href="#contact"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              o escríbeme →
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span>scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-muted-foreground to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden pb-2">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const { ref, x, y } = useMagnetic(0.4);
  return (
    <motion.a
      ref={ref as never}
      href={href}
      style={{ x, y }}
      className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_40px_-10px_var(--color-primary)] transition-shadow hover:shadow-[0_0_60px_-8px_var(--color-primary)]"
    >
      {children}
    </motion.a>
  );
}

function Arrow() {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className="transition-transform group-hover:translate-x-1"
    >
      <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </motion.svg>
  );
}

/* ---------------- Marquee ---------------- */

function Marquee() {
  const items = [
    "TypeScript",
    "React",
    "Node.js",
    "Postgres",
    "Rust",
    "Go",
    "AWS",
    "Redis",
    "GraphQL",
    "Kafka",
    "Docker",
    "Cloudflare",
  ];
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/30 py-6">
      <div className="flex" style={{ animation: "marquee 35s linear infinite", width: "max-content" }}>
        {[...items, ...items].map((it, i) => (
          <div key={i} className="flex items-center gap-8 px-8 font-mono text-xl text-muted-foreground">
            <span>{it}</span>
            <span className="text-primary">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Work ---------------- */

function Work() {
  return (
    <section id="work" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="01 / trabajo seleccionado" title="Cosas que envié a producción." />
        <div className="mt-16 divide-y divide-border border-y border-border">
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hover, setHover] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const previewX = useSpring(0, { stiffness: 150, damping: 20 });
  const previewY = useSpring(0, { stiffness: 150, damping: 20 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={(e) => {
        mouse.current = { x: e.clientX, y: e.clientY };
        previewX.set(e.clientX);
        previewY.set(e.clientY);
      }}
      className="group relative cursor-pointer"
      data-cursor="hover"
    >
      <div className="grid grid-cols-12 items-center gap-4 px-2 py-8 transition-colors group-hover:bg-surface/40">
        <div className="col-span-2 font-mono text-xs text-muted-foreground">{project.year}</div>
        <div className="col-span-12 md:col-span-4">
          <motion.h3
            animate={{ x: hover ? 12 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="font-display text-4xl md:text-5xl"
          >
            {project.name}
          </motion.h3>
        </div>
        <div className="col-span-12 text-sm text-muted-foreground md:col-span-4">
          {project.blurb}
        </div>
        <div className="col-span-12 flex flex-wrap justify-start gap-2 md:col-span-2 md:justify-end">
          {project.stack.slice(0, 2).map((s) => (
            <span
              key={s}
              className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      {/* floating accent bar */}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hover ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left"
        style={{ background: project.accent }}
      />
      {/* floating preview */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              left: mouse.current.x + 20,
              top: mouse.current.y - 80,
              pointerEvents: "none",
              zIndex: 60,
            }}
            className="hidden md:block"
          >
            <div
              className="h-32 w-48 overflow-hidden rounded-lg border border-border"
              style={{
                background: `linear-gradient(135deg, ${project.accent}, oklch(0.14 0.008 250))`,
              }}
            >
              <div className="grain absolute inset-0" />
              <div className="relative flex h-full flex-col justify-between p-3 font-mono text-[10px]">
                <span className="text-background/80">{project.role}</span>
                <span className="text-background/60">{project.stack.join(" · ")}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------- About ---------------- */

function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <motion.div style={{ y }} className="sticky top-32">
            <span className="font-mono text-xs text-muted-foreground">02 / sobre mí</span>
            <h2 className="mt-4 font-display text-5xl leading-none md:text-6xl">
              6 años.
              <br />
              <span className="italic text-muted-foreground">4 industrias.</span>
              <br />
              <span className="text-primary">1 obsesión.</span>
            </h2>
          </motion.div>
        </div>
        <div className="space-y-8 md:col-span-7">
          <p className="text-xl leading-relaxed text-foreground">
            Diseño y construyo producto de punta a punta: pienso en la arquitectura tanto como en el hover-state de un botón.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Creo que las mejores decisiones técnicas nacen de entender el negocio. Que la
            performance es un feature. Que un buen commit message es cortesía profesional. Y que
            si no puedes explicarlo, no lo entiendes.
          </p>

          <div className="mt-16 space-y-6">
            {EXPERIENCE.map((e, i) => (
              <motion.div
                key={e.company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group grid grid-cols-12 gap-4 border-t border-border pt-6"
              >
                <div className="col-span-4 font-mono text-xs text-muted-foreground">{e.period}</div>
                <div className="col-span-8">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-lg font-medium text-foreground">{e.company}</h4>
                    <span className="text-sm text-primary">{e.role}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{e.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stack ---------------- */

function Stack() {
  return (
    <section id="stack" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="03 / stack" title="Las herramientas que uso a diario." />
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {STACK.map((s, i) => (
            <motion.div
              key={s.group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative bg-background p-8 transition-colors hover:bg-surface"
            >
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              <h3 className="mt-4 font-display text-2xl">{s.group}</h3>
              <ul className="mt-6 space-y-2">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors group-hover:text-foreground"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary/60" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */

function Contact() {
  const { ref, x, y } = useMagnetic(0.15);
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32">
      <div className="mx-auto max-w-5xl text-center">
        <span className="font-mono text-xs text-muted-foreground">04 / contacto</span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.95]"
        >
          ¿Construimos <em className="italic text-primary">algo</em>?
        </motion.h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">
          Freelance, full-time, o solo para saludar y hablar de tipografía. Respondo rápido.
        </p>

        <motion.a
          ref={ref as never}
          style={{ x, y }}
          href="mailto:hola@lucianocaraba.dev"
          className="mt-12 inline-flex items-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 font-display text-2xl text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          hola@lucianocaraba.dev
          <span className="h-2 w-2 rounded-full bg-primary" />
        </motion.a>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-sm text-muted-foreground">
          {[
            { label: "GitHub", href: "#" },
            { label: "LinkedIn", href: "#" },
            { label: "X / Twitter", href: "#" },
            { label: "Read.cv", href: "#" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              {s.label}
              <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const upd = () =>
      setTime(
        new Date().toLocaleTimeString("es-UY", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/Montevideo",
        }),
      );
    upd();
    const t = setInterval(upd, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Luciano Caraballo · Diseñado y programado a mano.</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          PDU · {time}
        </span>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="font-mono text-xs text-muted-foreground">{eyebrow}</span>
        <h2 className="mt-4 max-w-2xl font-display text-5xl leading-none md:text-6xl">{title}</h2>
      </div>
    </div>
  );
}

/* ---------------- Scroll progress ---------------- */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-primary"
    />
  );
}

/* ---------------- Root ---------------- */

export function Portfolio() {
  return (
    <main className="relative">
      <ScrollProgress />
      <CustomCursor />
      <Nav />
      <Hero />
      <Marquee />
      <Work />
      <About />
      <Stack />
      <Contact />
      <Footer />
    </main>
  );
}
