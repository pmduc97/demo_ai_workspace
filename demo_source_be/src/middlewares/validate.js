function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validate(rules, body) {
  const errors = [];
  for (const rule of rules) {
    const value = body[rule.field];
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({ field: rule.field, message: `${rule.field} is required` });
      continue;
    }
    if (value === undefined || value === null) continue;
    if (rule.type === 'string' && typeof value !== 'string') errors.push({ field: rule.field, message: `${rule.field} must be a string` });
    if (rule.type === 'number' && typeof value !== 'number') errors.push({ field: rule.field, message: `${rule.field} must be a number` });
    if (rule.enum && !rule.enum.includes(value)) errors.push({ field: rule.field, message: `${rule.field} must be one of: ${rule.enum.join(', ')}` });
    if (rule.min && isNonEmptyString(value) && value.trim().length < rule.min) errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.min} chars` });
    if (rule.pattern && isNonEmptyString(value) && !rule.pattern.test(value)) errors.push({ field: rule.field, message: `${rule.field} format is invalid` });
  }
  return errors;
}

module.exports = { validate };
