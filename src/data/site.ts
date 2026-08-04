import type { IconType } from "react-icons";
import { SiGithub, SiLeetcode, SiGmail } from "react-icons/si";
// LinkedIn was removed from the simple-icons set bundled with react-icons v5;
// fa6 still ships it.
import { FaLinkedinIn } from "react-icons/fa6";

export const site = {
  name: "Jaideep Kundu",
  firstName: "Jaideep",
  role: "Backend & Full-Stack Engineer",
  tagline: "Final-year B.Tech CSE @ VIT-AP · ex-SDE Intern @ Bluestock Fintech",
  blurb:
    "Real-time systems, retrieval pipelines, and the tests that keep them honest.",
  email: "jaideepkundu92@gmail.com",
  phone: "+91 96084 25857",
  location: "Amaravati, India",
  resumePath: "/resume.pdf",
  url: "https://jaideepkundu.vercel.app",

  github: "jaicod11",
  leetcode: "devil2411",
} as const;

export type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
  /** Tailwind text colour applied on hover. */
  hoverClass: string;
};

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: `https://github.com/${site.github}`,
    icon: SiGithub,
    hoverClass: "group-hover:text-white",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jaideep-kundu/",
    icon: FaLinkedinIn,
    hoverClass: "group-hover:text-[#0A66C2]",
  },
  {
    label: "LeetCode",
    href: `https://leetcode.com/u/${site.leetcode}/`,
    icon: SiLeetcode,
    hoverClass: "group-hover:text-[#FFA116]",
  },
  {
    label: "Email",
    href: `mailto:${site.email}`,
    icon: SiGmail,
    hoverClass: "group-hover:text-[#EA4335]",
  },
];

export type NavItem = { id: string; label: string; index: string };

export const navItems: NavItem[] = [
  { id: "hero", label: "Home", index: "01" },
  { id: "about", label: "About", index: "02" },
  { id: "projects", label: "Projects", index: "03" },
  { id: "skills", label: "Skills", index: "04" },
  { id: "stats", label: "Stats", index: "05" },
  { id: "contact", label: "Contact", index: "06" },
];
