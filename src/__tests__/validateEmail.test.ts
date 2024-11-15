import { validateEmail } from '../utils/index';

describe('validateEmail function', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('john@silva.com.br')).toBe(true);
    expect(validateEmail('luigi@carluccio.it')).toBe(true);
    expect(validateEmail('user-tag@example.org')).toBe(true);
    expect(validateEmail('user.name-tag-123@sub.example.com')).toBe(true);
  });

  it('should invalidate incorrect email addresses', () => {
    expect(validateEmail('userexample.com')).toBe(false);
    expect(validateEmail('user@example')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('  ')).toBe(false);
    expect(validateEmail('user@example.c')).toBe(false);
    expect(validateEmail('user@example.')).toBe(false);
  });
});