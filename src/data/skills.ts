import type { IconType } from "react-icons";
import {
  SiC,
  SiCplusplus,
  SiCss,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFlask,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiLangchain,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiRedis,
  SiSocketdotio,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { FaAws, FaJava } from "react-icons/fa6";
import {
  Boxes,
  Braces,
  Brain,
  Database,
  GitBranch,
  Layers,
  Network,
  Radio,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export type Skill = {
  name: string;
  icon: IconType | React.ComponentType<{ className?: string }>;
  /** Brand colour, applied to the glyph on hover. */
  color: string;
};

export type SkillGroup = {
  id: string;
  title: string;
  /** Mono caption under the group title. */
  caption: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    caption: "core",
    skills: [
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Java", icon: FaJava, color: "#E76F00" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "SQL", icon: Database, color: "#22D3EE" },
      { name: "C", icon: SiC, color: "#A8B9CC" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    caption: "interfaces",
    skills: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS", icon: SiCss, color: "#663399" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    caption: "services",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express", icon: SiExpress, color: "#FFFFFF" },
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "Flask", icon: SiFlask, color: "#FFFFFF" },
      { name: "REST APIs", icon: Braces, color: "#22D3EE" },
      { name: "WebSockets", icon: Radio, color: "#A855F7" },
      { name: "Socket.io", icon: SiSocketdotio, color: "#FFFFFF" },
      { name: "Microservices", icon: Boxes, color: "#A855F7" },
      { name: "JWT Auth", icon: SiJsonwebtokens, color: "#FF2D20" },
    ],
  },
  {
    id: "ai",
    title: "AI / ML",
    caption: "retrieval & models",
    skills: [
      { name: "RAG", icon: Sparkles, color: "#22D3EE" },
      { name: "LangChain", icon: SiLangchain, color: "#FFFFFF" },
      { name: "Agentic AI", icon: Network, color: "#A855F7" },
      { name: "Gemini API", icon: SiGooglegemini, color: "#8E75B2" },
      { name: "Vector Search", icon: Layers, color: "#22D3EE" },
      { name: "Pinecone", icon: Brain, color: "#A855F7" },
      { name: "XGBoost", icon: TrendingUp, color: "#10B981" },
      { name: "pandas", icon: SiPandas, color: "#FFFFFF" },
      { name: "NumPy", icon: SiNumpy, color: "#4DABCF" },
    ],
  },
  {
    id: "data",
    title: "Databases & Storage",
    caption: "persistence",
    skills: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "Redis", icon: SiRedis, color: "#FF4438" },
      { name: "SQLite", icon: SiSqlite, color: "#003B57" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Infra",
    caption: "ship it",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "AWS", icon: FaAws, color: "#FF9900" },
      { name: "CI/CD", icon: GitBranch, color: "#22D3EE" },
      { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
    ],
  },
];
