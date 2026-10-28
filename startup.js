// Browser storage and URL values must not prevent a fresh game from starting.
export function parsePreferences(raw) {
  try {
    const value = JSON.parse(raw ?? '{}');
    return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

export function parseLevelIndex(raw, count) {
  const level = Number(raw);
  return Number.isInteger(level) && level >= 1 && level <= count ? level - 1 : null;
}
