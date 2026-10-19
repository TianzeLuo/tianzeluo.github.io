export type Section = 'research' | 'projects' | 'writing';

/**
 * Sections are hidden from navigation and route generation until they have real
 * content. Keep the content files in place so the section can be restored later.
 */
export const enabledSections: readonly Section[] = ['projects'];

export const isSectionEnabled = (section: Section) => enabledSections.includes(section);
