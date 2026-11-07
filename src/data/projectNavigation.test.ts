import { describe, expect, it } from "vitest";
import { FEATURED } from "./projects";
import { CASE_PROJECTS, SUPPORTING_PROJECTS, PORTFOLIO_PROJECTS, getProjectJourney } from "./projectNavigation";

describe("Editorial portfolio navigation", () => {
  it("keeps explained case studies first, followed by distinct supporting work", () => {
    expect(CASE_PROJECTS.map((project) => project.slug)).toEqual(["medsharing", "flylooping", "echo-travel", "blueowl"]);
    expect(SUPPORTING_PROJECTS.map((project) => project.slug)).toEqual(["emargo", "largo", "n8n-nodes-opn", "paykit", "twenty-crm", "weave"]);
    expect(PORTFOLIO_PROJECTS).toHaveLength(FEATURED.length);
    expect(new Set(PORTFOLIO_PROJECTS.map((project) => project.slug)).size).toBe(FEATURED.length);
  });

  it("only recommends the next or previous case study among documented cases", () => {
    expect(getProjectJourney("medsharing").previous).toBeNull();
    expect(getProjectJourney("medsharing").next?.slug).toBe("flylooping");
    expect(getProjectJourney("echo-travel").previous?.slug).toBe("flylooping");
    expect(getProjectJourney("echo-travel").next?.slug).toBe("blueowl");
    expect(getProjectJourney("blueowl").previous?.slug).toBe("echo-travel");
    expect(getProjectJourney("paykit").isCaseStudy).toBe(false);
    expect(getProjectJourney("blueowl").next).toBeNull();
    expect(getProjectJourney("twenty-crm").isCaseStudy).toBe(false);
    expect(getProjectJourney("twenty-crm").next?.slug).toBe("weave");
  });

  it("navigates supporting projects without mixing their evidence with case studies", () => {
    expect(getProjectJourney("emargo").isCaseStudy).toBe(false);
    expect(getProjectJourney("emargo").previous).toBeNull();
    expect(getProjectJourney("emargo").next?.slug).toBe("largo");
    expect(getProjectJourney("largo").next?.slug).toBe("n8n-nodes-opn");
    expect(getProjectJourney("weave").next).toBeNull();
    expect(getProjectJourney("non-existent")).toEqual({ isCaseStudy: false, previous: null, next: null });
  });
});
