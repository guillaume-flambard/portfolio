import type { ReactElement } from "react";

export type LabProject = {
  name: string;
  tier: string;
  status: string;
  visibility: string;
  url: string | null;
  repo: string | null;
  description: string;
  language: string | null;
  lab_candidate: boolean;
};

const TINTS = ["t1", "t2", "t3", "t4", "t5"];

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  beta: "Beta",
  lab: "WIP",
  internal: "Internal",
  private: "Private",
  archived: "Stale",
};

function tint(name: string): string {
  const sum = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return TINTS[sum % TINTS.length];
}

function LabCard({ p }: { p: LabProject }): ReactElement {
  const desc = p.description && p.description !== "projet local (pas de repo GitHub)"
    ? p.description
    : "Experiment in the Memo Labs playground.";
  const status = STATUS_LABEL[p.status] ?? "WIP";
  const dotCls = p.status === "live" ? "" : p.status === "beta" ? " warn" : " lab";
  const href = p.url ?? p.repo ?? "https://memolabs.dev";
  const lang = p.language ? <span className="chip">{p.language}</span> : null;

  return (
    <a className="card" href={href} target="_blank" rel="noopener noreferrer">
      <div className={`thumb ${tint(p.name)}`}>{p.name}</div>
      <div className="cbody">
        <h3>
          {p.name}<span className="arrow">→</span>
        </h3>
        <p>{desc}</p>
        <div className="stack">{lang}</div>
        <div className="curl">
          <span className={`dot${dotCls}`} aria-hidden />
          {status}
          <span className="arr">↗</span>
        </div>
      </div>
    </a>
  );
}

export default function LabGrid({ projects }: { projects: LabProject[] }): ReactElement {
  const live = projects.filter((p) => p.status === "live");
  const lab = projects.filter((p) => p.lab_candidate);

  const section = (title: string, lede: string, items: LabProject[]) => (
    <section className="sec">
      <div className="wrap">
        <div className="shead">
          <h2 className="display">{title}</h2>
          <p>{lede}</p>
        </div>
        <div className="grid">
          {items.map((p) => <LabCard key={p.name} p={p} />)}
        </div>
      </div>
    </section>
  );

  return (
    <>
      {section("Live", "Shipped and running on the lab.", live)}
      {section("Playground", `${lab.length} WIP experiments — prototypes, agents and tools.`, lab)}
    </>
  );
}
