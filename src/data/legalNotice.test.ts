import { describe, expect, it } from "vitest";
import fr from "@/i18n/messages/fr.json";
import en from "@/i18n/messages/en.json";

describe("legal disclosure copy", () => {
  it("uses independently verified editor registration for both locales", () => {
    for (const legal of [fr.legal, en.legal]) {
      expect(legal.editor).toContain("Guillaume Flambard");
      expect(legal.editor).toContain("Memo Labs");
      expect(legal.siren).toContain("924 107 469");
      expect(legal.editor).not.toMatch(/micro-entrepreneur|being registered|en cours d'immatriculation/);
      expect(legal.siren).not.toMatch(/à compléter|to be completed|TBD/i);
    }
  });

  it("displays verified host contact and not a private server address", () => {
    for (const legal of [fr.legal, en.legal]) {
      expect(legal.host).toContain("netcup GmbH");
      expect(legal.host).toContain("Emmy-Noether-Straße 10");
      expect(legal.host).toContain("+49 721 7540755-0");
      expect(legal.host).not.toContain("159.195.213.26");
      expect(legal.host).not.toContain("Coolify");
    }
  });

  it("keeps a working publisher email contact", () => {
    for (const legal of [fr.legal, en.legal]) {
      expect(legal.contact).toContain("mailto:contact@memolabs.dev");
    }
  });
});
