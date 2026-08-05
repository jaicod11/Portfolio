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
    slug: "deepcontext-engine",
    title: "DeepContext Engine",
    summary:
      "Agentic RAG platform for multi-format document retrieval with citation-grounded, streaming answers.",
    detail:
      "LangChain + FastAPI pipeline with Gemini embeddings in Pinecone (285+ dense vectors, 3072-dim, cosine), cross-encoder reranking and per-document metadata filtering across a PDF/PPTX/XLSX corpus. React 18 frontend streams citation-grounded chat backed by Redis response caching.",
    stack: ["Python", "LangChain", "FastAPI", "Pinecone", "Gemini", "React", "Redis", "Docker"],
    repo: "https://github.com/jaicod11/DeepContext-Engine",
    accent: ["#22d3ee", "#6366f1"],
    metrics: [
      { value: "3072", label: "dim vectors" },
      { value: "285+", label: "indexed chunks" },
      { value: "3", label: "file formats" },
    ],
  },
  {
    slug: "collabdocs",
    title: "CollabDocs",
    summary:
      "Real-time collaborative editor with a custom Operational Transformation engine written from scratch.",
    detail:
      "OT engine achieving 100% conflict-free consistency across concurrent sessions via event sequencing and client-server reconciliation. Horizontally scalable sync layer on Socket.io + Redis Pub/Sub cuts propagation to <50ms with zero duplication across nodes. Full MERN platform with JWT auth and an 8+ page React frontend.",
    stack: ["React", "Node.js", "Socket.io", "Redis", "MongoDB", "Express", "JWT"],
    repo: "https://github.com/jaicod11/collab-editor",
    accent: ["#a855f7", "#ec4899"],
    metrics: [
      { value: "<50ms", label: "sync latency" },
      { value: "9", label: "transform cases handled" },
      { value: "8+", label: "app views" },
    ],
  },
  {
    slug: "store-intelligence",
    title: "Store-Intelligence",
    summary:
      "3-microservice CCTV analytics platform turning surveillance footage into foot-traffic and security insight.",
    detail:
      "Built for Purplle's SDE challenge. YOLOv8 + ByteTrack person tracking, a custom dwell-time tracker for loitering detection, and Gemini Vision for real-time activity classification. CV and API layers decoupled over Redis Pub/Sub, with MongoDB aggregation pipelines feeding Socket.io alerts, PDF reports and a React dashboard.",
    stack: ["Python", "FastAPI", "YOLOv8", "Node.js", "Redis", "Socket.io", "MongoDB"],
    repo: "https://github.com/jaicod11/Store-Intelligence",
    accent: ["#f59e0b", "#ef4444"],
    metrics: [
      { value: "3", label: "microservices" },
      { value: "YOLOv8", label: "+ ByteTrack" },
      { value: "RT", label: "alerting" },
    ],
  },
  {
    slug: "meddiagno",
    title: "MedDiagno",
    summary:
      "Three-disease ML screening platform for diabetes, heart disease and skin cancer at 87%+ accuracy.",
    detail:
      "XGBoost and Gradient Boosting models delivering 87%+ accuracy at <2s inference, behind a modular Flask Blueprint architecture. Session auth via Flask-Login + bcrypt, MongoDB Atlas prediction history, and a Chart.js analytics dashboard — containerised with Docker and deployed on Render.",
    stack: ["Flask", "MongoDB", "XGBoost", "Chart.js", "Docker", "Python"],
    repo: "https://github.com/jaicod11/MedDiagno",
    live: "https://meddiagno.onrender.com/",
    accent: ["#10b981", "#22d3ee"],
    metrics: [
      { value: "87%+", label: "accuracy" },
      { value: "<2s", label: "inference" },
      { value: "3", label: "conditions" },
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
      "Ultra-low-latency multi-threaded limit order matching engine processing 100K+ orders/sec at microsecond latency, using Red-Black tree order books, hash indexing and lock-free queues.",
    stack: ["C++", "Systems", "Concurrency"],
    repo: "https://github.com/jaicod11/ApexMatch",
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
    title: "Metadata-Driven-App",
    blurb:
      "A runtime that turns JSON configuration into a working app — dynamic UI, REST APIs, database and workflows, generated from metadata.",
    stack: ["TypeScript", "Next.js", "PostgreSQL", "Prisma"],
    repo: "https://github.com/jaicod11/Metadata-Driven-App",
    live: "https://metadata-driven-app.vercel.app",
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
