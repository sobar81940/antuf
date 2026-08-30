/**
 * Constants for the dedicated "Youth Committee" association.
 *
 * The youth organization is a SEPARATE association (slug "youth-committee")
 * managed independently from the professional associations. It is excluded
 * from the normal association list so it doesn't appear as a regular card on
 * the organization dashboard - it is reached via its own sidebar entry.
 */
export const YOUTH_NAME = "युवा समिति";
export const YOUTH_NAME_EN = "Youth Committee";
export const YOUTH_SLUG = "youth-committee";
export const isYouthAssociation = (value: string | undefined | null) =>
  value === YOUTH_SLUG || value === YOUTH_NAME || value === YOUTH_NAME_EN;