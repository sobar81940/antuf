/**
 * Constants for the dedicated "Women's Committee" association.
 *
 * The women's organization is a SEPARATE association (slug "women-committee")
 * managed independently from the professional associations. It is excluded
 * from the normal association list so it doesn't appear as a regular card on
 * the organization dashboard - it is reached via its own sidebar entry.
 */
export const WOMEN_NAME = "महिला समिति";
export const WOMEN_NAME_EN = "Women's Committee";
export const WOMEN_SLUG = "women-committee";
export const isWomenAssociation = (value: string | undefined | null) =>
  value === WOMEN_SLUG || value === WOMEN_NAME || value === WOMEN_NAME_EN;