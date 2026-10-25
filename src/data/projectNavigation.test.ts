import { describe, expect, it } from "vitest";
import { FEATURED } from "./projects";
import { CASE_PROJECTS, SUPPORTING_PROJECTS, PORTFOLIO_PROJECTS, getProjectJourney } from "./projectNavigation";

describe("Editorial portfolio navigation", () => {
  it("keeps explained case studies first, followed by distinct supporting work", () => {
    expect(CASE_PROJECTS.map((project) => project.slug)).toEqual(["echo-travel", "paykit", "blueowl"]);
    expect(SUPPORTING_PROJECTS.map((project) => project.slug)).toEqual(["emargo", "weave", "n8n-nodes-opn", "largo"]);
    expect(PORTFOLIO_PROJECTS).toHaveLength(FEATURED.length);
    expect(new Set(PORTFOLIO_PROJECTS.map((project) => project.slug)).size).toBe(FEATURED.length);
  });

  it("only recommends the next or previous case study among documented cases", () => {
    expect(getProjectJourney("echo-travel").previous).toBeNull();
    expect(getProjectJourney("echo-travel").next?.slug).toBe("paykit");
    expect(getProjectJourney("paykit").previous?.slug).toBe("echo-travel");
    expect(getProjectJourney("paykit").next?.slug).toBe("blueowl");
    expect(getProjectJourney("blueowl").next).toBeNull();
  });

  it("navigates supporting projects without mixing their evidence with case studies", () => {
    expect(getProjectJourney("emargo").isCaseStudy).toBe(false);
    expect(getProjectJourney("emargo").previous).toBeNull();
    expect(getProjectJourney("emargo").next?.slug).toBe("weave");
    expect(getProjectJourney("largo").next).toBeNull();
    expect(getProjectJourney("non-existent")).toEqual({ isCaseStudy: false, previous: null, next: null });
  });
});
