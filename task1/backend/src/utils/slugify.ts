export const slugify = (text: string): string => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces → dashes
    .replace(/[^\w\-]+/g, '') // remove non-word chars
    .replace(/\-\-+/g, '-') // collapse dashes
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
};
