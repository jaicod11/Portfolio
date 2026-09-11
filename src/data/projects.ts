export type Project = {
  slug: string;
  title: string;
  /** Shown on the featured card face. */
  summary: string;
  /** Revealed on the hover/tap overlay. */
  detail: string;
  stack: string[];
  repo: string;
  live?: string;
  /**
   * Optional screenshot at e.g. "/projects/deepcontext.png".
   * When absent the card renders a generated poster instead, so the grid
   * never shows a broken/empty image well.
   */
  image?: string;
  /** Poster gradient — [from, to] as hex. */
  accent: [string, string];
  /** Two or three headline numbers rendered as mono chips. */
  metrics: { value: string; label: string }[];
};

export const featuredProjects: Project[] = [
  {
    slug: "collabdocs",
    title: "CollabDocs",
    summary:
      "Real-time collaborative editor built on an Operational Transformation engine written from scratch.",
    detail:
      "An OT engine written from scratch — no Yjs, no ShareDB — resolving concurrent edits through server-side event sequencing and client-server reconciliation. The sync layer scales horizontally on Socket.io + Redis Pub/Sub, holding update propagation under 50ms with no duplicated messages across instances. 300+ tests across 24 files cover convergence sweeps, fuzz and concurrent admission.",
    stack: ["React", "Node.js", "Socket.io", "Redis", "MongoDB"],
    repo: "https://github.com/jaicod11/collab-editor",
    live: "https://collab-ediitor.vercel.app/",
    accent: ["#a855f7", "#ec4899"],
    metrics: [
      { value: "<50ms", label: "sync latency" },
      { value: "8+", label: "app views" },
      { value: "300+", label: "tests passing" },
    ],
  },
  {
    slug: "deepcontext-engine",
    title: "DeepContext Engine",
    summary:
      "Multi-tenant RAG platform with two-stage retrieval and page-level citations across seven document formats.",
    detail:
      "Two-stage retrieval: ANN search over 3072-dim Gemini embeddings in Pinecone, refined by cross-encoder reranking. Ingests seven document formats and grounds every answer in page- and slide-level citations back to the exact chunk used. A multi-tier LLM fallback chain keeps requests succeeding during provider outages by switching models automatically.",
    stack: ["Python", "FastAPI", "LangChain", "Pinecone", "Gemini", "React", "Docker"],
    repo: "https://github.com/jaicod11/DeepContext-Engine",
    live: "https://deep-context.vercel.app/",
    accent: ["#22d3ee", "#6366f1"],
    metrics: [
      { value: "7", label: "file formats" },
      { value: "3072", label: "dim vectors" },
      { value: "2-stage", label: "retrieval" },
    ],
  },
  {
    slug: "rto-shield",
    title: "RTO Shield",
    summary:
      "COD return-risk scoring for Indian e-commerce — calibrated probabilities priced into a three-action policy.",
    detail:
      "A scoring pipeline built on time-based splits, out-of-fold target encoding and an isotonic-calibrated LightGBM, validated against a logistic regression and a rules baseline across 120K+ orders. Asymmetric misclassification costs are modelled into a three-action pricing policy worth Rs. 53K per 10K orders over baseline, served from FastAPI with background-thread model loading for zero-downtime cold starts.",
    stack: ["Python", "LightGBM", "scikit-learn", "Next.js", "TypeScript", "Tailwind"],
    repo: "https://github.com/jaicod11/RTO-Shield",
    live: "https://risk-trade-shield.vercel.app/",
    accent: ["#f59e0b", "#ef4444"],
    metrics: [
      { value: "120K+", label: "orders" },
      { value: "Rs. 53K", label: "saved / 10K" },
      { value: "calibrated", label: "probabilities" },
    ],
  },
  {
    slug: "metadata-driven-app",
    title: "Metadata Driven App",
    summary:
      "A metadata-driven runtime that generates a full working app — UI, REST APIs and persistence — from JSON config.",
    detail:
      "Zero per-entity code: a single-table JSONB store and a lazy-loading ComponentRegistry resolve arbitrary schemas at runtime, so adding an entity is a config change rather than a migration plus a set of handlers. Runs serverless on Vercel over pooled Neon Postgres through Prisma, with SWR caching and Zustand state on the client.",
    stack: ["Next.js", "React", "TypeScript", "Prisma", "Neon Postgres", "SWR", "Zustand"],
    repo: "https://github.com/jaicod11/Metadata-Driven-App",
    live: "https://metadata-driven-app.vercel.app",
    accent: ["#10b981", "#22d3ee"],
    metrics: [
      { value: "0", label: "per-entity code" },
      { value: "JSONB", label: "single-table store" },
      { value: "runtime", label: "schema resolution" },
    ],
  },
];

export type OtherProject = {
  title: string;
  blurb: string;
  stack: string[];
  repo: string;
  live?: string;
};

export const otherProjects: OtherProject[] = [
  {
    title: "ApexMatch",
    blurb:
      "Multi-threaded limit order matching engine in C++, designed for microsecond-latency matching; benchmarks in progress. Red-Black tree order books with hash indexing, lock-free queues and thread-per-symbol sharding.",
    stack: ["C++", "Systems", "Concurrency"],
    repo: "https://github.com/jaicod11/ApexMatch",
  },
  {
    title: "RiskFrontier",
    blurb:
      "Monte Carlo VaR/CVaR engine over 124K daily NSE price rows, running parametric correlated-normal against historical block-bootstrap — which exposes a 31% CVaR divergence at the 99% level that the normality assumption conceals. Leak-free walk-forward backtester with Markowitz re-optimisation, no-lookahead proven via byte-identical truncation tests.",
    stack: ["Python", "FastAPI", "PostgreSQL", "NumPy", "SciPy", "React", "TypeScript", "Docker"],
    repo: "https://github.com/jaicod11/RiskFrontier",
    live: "https://riskfrontier.vercel.app",
  },
  {
    title: "Store-Intelligence",
    blurb:
      "3-microservice CCTV analytics platform turning surveillance footage into foot-traffic and security insight. YOLOv8 + ByteTrack person tracking, a custom dwell-time tracker for loitering detection, and Gemini Vision for activity classification — CV and API layers decoupled over Redis Pub/Sub, feeding Socket.io alerts and a React dashboard.",
    stack: ["Python", "FastAPI", "YOLOv8", "Node.js", "Redis", "Socket.io", "MongoDB"],
    repo: "https://github.com/jaicod11/Store-Intelligence",
  },
  {
    title: "MedDiagno",
    blurb:
      "Screening platform for three conditions — diabetes, heart disease and skin lesion features — each served by its own independently trained gradient-boosted classifier behind a modular Flask Blueprint app. Evaluated per class rather than on headline accuracy, since a false negative in screening costs far more than a false positive. MongoDB Atlas prediction history, containerised with Docker.",
    stack: ["Python", "Flask", "XGBoost", "scikit-learn", "MongoDB", "Docker"],
    repo: "https://github.com/jaicod11/MedDiagno",
  },
  {
    title: "Compensation-Intelligence",
    blurb:
      "Compensation platform comparing total comp (base + bonus + stock) across Indian tech companies by level rather than job title.",
    stack: ["TypeScript", "Next.js", "PostgreSQL", "Prisma"],
    repo: "https://github.com/jaicod11/Compensation-Intelligence",
    live: "https://compensation-intelligence-smoky.vercel.app",
  },
  {
    title: "Mutual-Fund-Analytics",
    blurb:
      "End-to-end mutual fund analytics for India: ETL pipeline, SQLite star schema, risk metrics (Sharpe, VaR, Alpha, Beta, CAGR), a fund recommender and a Tableau dashboard over 40 schemes.",
    stack: ["Python", "SQL", "pandas", "Plotly", "Tableau"],
    repo: "https://github.com/jaicod11/Mutual-Fund-Analytics",
  },
  {
    title: "TicTacToe Engine",
    blurb:
      "A mathematically perfect Tic-Tac-Toe engine in C++17 using NegaMax with alpha-beta pruning to reach a Nash equilibrium strategy.",
    stack: ["C++", "Algorithms"],
    repo: "https://github.com/jaicod11/tictactoe",
  },
  {
    title: "LifeTracker",
    blurb:
      "Full-stack life tracking app for managing daily tasks and activities, with auth and persistent activity history.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    repo: "https://github.com/jaicod11/lifeTracker",
    live: "https://liife-tracker.vercel.app/",
  },
  {
    title: "Student Performance Predictor",
    blurb:
      "ML web app predicting student performance, with analytics, personalised recommendations and academic insight dashboards.",
    stack: ["Python", "Machine Learning", "Flask"],
    repo: "https://github.com/jaicod11/student-performance-predictor",
  },
  {
    title: "DSA Archive",
    blurb:
      "Ongoing archive of solved data-structures and algorithms problems, organised by pattern and difficulty.",
    stack: ["C++", "Algorithms"],
    repo: "https://github.com/jaicod11/DSA",
  },
];

/** Tag universe for the client-side filter, ordered by frequency then name. */
export const otherProjectTags: string[] = Array.from(
  new Set(otherProjects.flatMap((p) => p.stack)),
).sort((a, b) => {
  const count = (t: string) => otherProjects.filter((p) => p.stack.includes(t)).length;
  return count(b) - count(a) || a.localeCompare(b);
});
