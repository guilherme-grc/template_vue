/**
 * Gets a value from a nested object using a string path (e.g., 'a.b.c')
 */
export function getNestedValue(obj, path) {
  if (!path) return undefined;
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : undefined;
  }, obj);
}

/**
 * Sets a value in a nested object using a string path (e.g., 'a.b.c')
 */
export function setNestedValue(obj, path, value) {
  if (!path) return obj;
  const keys = path.split('.');
  const lastKey = keys.pop();
  const lastObj = keys.reduce((prev, curr) => {
    if (!prev[curr]) prev[curr] = {};
    return prev[curr];
  }, obj);
  lastObj[lastKey] = value;
  return obj;
}
