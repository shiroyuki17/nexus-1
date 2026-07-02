export function toPascalCase(value) {
  return String(value)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function entityEventName(entity, action) {
  return `${toPascalCase(entity)}${action}`;
}
