import { render, screen } from "@testing-library/react";
import { ISLANDS } from "@/content/islands";
import ListView from "@/components/ListView";

const labels = {
  title: "All Islands",
  liveDemo: "Live demo",
  code: "Code",
  demoSoon: "Demo soon",
};

describe("ListView", () => {
  it("renders all 5 island titles", () => {
    render(<ListView islands={ISLANDS} locale="en" labels={labels} />);

    for (const island of ISLANDS) {
      expect(
        screen.getByRole("heading", { name: island.titles.en }),
      ).toBeTruthy();
    }
  });

  it("renders every live project as an anchor with an href, and non-live projects with no link", () => {
    render(<ListView islands={ISLANDS} locale="en" labels={labels} />);

    const allProjects = ISLANDS.flatMap((island) => island.projects ?? []);
    const liveProjects = allProjects.filter((p) => p.live && p.url);
    const nonLiveProjects = allProjects.filter((p) => !p.live);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));

    for (const project of liveProjects) {
      expect(hrefs).toContain(project.url);
    }

    expect(screen.getAllByText(labels.demoSoon)).toHaveLength(
      nonLiveProjects.length,
    );
  });
});
