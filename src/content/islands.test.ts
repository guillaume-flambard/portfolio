import { ISLANDS, getIsland } from './islands'

test('has exactly the 5 canonical islands', () => {
  expect(ISLANDS.map(i => i.slug).sort()).toEqual(['ai', 'craft', 'echo', 'home', 'lighthouse'])
})

test('getIsland returns typed island with bilingual titles', () => {
  const c = getIsland('craft')!
  expect(c.titles.fr).toBeTruthy()
  expect(c.titles.en).toBeTruthy()
  expect(c.pos).toHaveLength(2)
})

test('every project on craft isle has a stack and live flag', () => {
  for (const p of getIsland('craft')!.projects ?? []) {
    expect(Array.isArray(p.stack)).toBe(true)
    expect(typeof p.live).toBe('boolean')
  }
})
