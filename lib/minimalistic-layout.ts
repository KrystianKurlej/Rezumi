export const MINIMALISTIC_LEFT_SECTION_IDS = {
  contact: 'minimalist-left-contact',
  about: 'minimalist-left-about',
  skills: 'minimalist-left-skills',
} as const;

export const MINIMALISTIC_RIGHT_SECTION_IDS = {
  experiences: 'minimalist-right-experiences',
  educations: 'minimalist-right-educations',
  courses: 'minimalist-right-courses',
  freelance: 'minimalist-right-freelance',
  additionalActivities: 'minimalist-right-additional-activities',
} as const;

export const MINIMALISTIC_RIGHT_SECTION_ID_ORDER = [
  MINIMALISTIC_RIGHT_SECTION_IDS.experiences,
  MINIMALISTIC_RIGHT_SECTION_IDS.educations,
  MINIMALISTIC_RIGHT_SECTION_IDS.courses,
  MINIMALISTIC_RIGHT_SECTION_IDS.freelance,
  MINIMALISTIC_RIGHT_SECTION_IDS.additionalActivities,
] as const;

export const MINIMALISTIC_LEFT_SECTION_ID_ORDER = [
  MINIMALISTIC_LEFT_SECTION_IDS.contact,
  MINIMALISTIC_LEFT_SECTION_IDS.about,
  MINIMALISTIC_LEFT_SECTION_IDS.skills,
] as const;

type LayoutNode = {
  props?: Record<string, unknown>;
  children?: LayoutNode[];
} & Record<string, unknown>;

function extractPages(layout: unknown): LayoutNode[] {
  if (!layout || typeof layout !== 'object') return [];
  const root = layout as LayoutNode;
  const children = (root.children ?? (root as any).pages) as unknown;
  if (!Array.isArray(children)) return [];
  return children.filter((c) => c && typeof c === 'object') as LayoutNode[];
}

function collectIds(node: unknown, ids: Set<string>): void {
  if (!node || typeof node !== 'object') return;

  const layoutNode = node as LayoutNode;
  const id = layoutNode.props?.id;
  if (typeof id === 'string') ids.add(id);

  const children = layoutNode.children;
  if (!Array.isArray(children) || children.length === 0) return;

  for (const child of children) collectIds(child, ids);
}

export function collectIdsByPage(layout: unknown): Array<Set<string>> {
  const pages = extractPages(layout);

  return pages.map((page) => {
    const ids = new Set<string>();
    collectIds(page, ids);
    return ids;
  });
}

export function analyzeMinimalisticOverflow(layout: unknown): {
  pageCount: number;
  leftOverflow: boolean;
  overflowFromSectionId: string | null;
} {
  const idsByPage = collectIdsByPage(layout);
  const pageCount = idsByPage.length;

  const page1Ids = idsByPage[0] ?? new Set<string>();
  const laterIds = new Set<string>();

  for (const ids of idsByPage.slice(1)) {
    for (const id of ids) laterIds.add(id);
  }

  const leftOverflow = MINIMALISTIC_LEFT_SECTION_ID_ORDER.some((id) => laterIds.has(id));

  const allIds = new Set<string>([...page1Ids, ...laterIds]);
  const overflowFromSectionId =
    MINIMALISTIC_RIGHT_SECTION_ID_ORDER.find((id) => allIds.has(id) && !page1Ids.has(id)) ?? null;

  return {
    pageCount,
    leftOverflow,
    overflowFromSectionId,
  };
}
