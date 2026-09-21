/**
 * Mapowanie autorów commitów GitHub → czytelna nazwa.
 * Dodaj tu kolejnych kolegów (login GitHub / e-mail z commita).
 */
export const AUTHOR_DISPLAY_NAMES = {
  login101i: 'Maciej Kruszyniak',
  'maciejkruszyniak@gmail.com': 'Maciej Kruszyniak',
};

export function displayAuthor(commit) {
  const login = commit?.author?.login;
  const name = commit?.commit?.author?.name;
  const email = commit?.commit?.author?.email;

  if (login && AUTHOR_DISPLAY_NAMES[login]) {
    return AUTHOR_DISPLAY_NAMES[login];
  }
  if (email && AUTHOR_DISPLAY_NAMES[email.toLowerCase()]) {
    return AUTHOR_DISPLAY_NAMES[email.toLowerCase()];
  }
  return name || login || 'Nieznany autor';
}
