import { describe, it, expect } from 'vitest';
import { semverChapterSort } from './content';

describe('semver test', () => {
	it('longer', () => {
		expect(semverChapterSort('1', '1.0')).toBe(-1);
		expect(semverChapterSort('1.0', '1')).toBe(1);
		expect(semverChapterSort('1.0', '1.0.0')).toBe(-1);
		expect(semverChapterSort('1.0.0', '1.0')).toBe(1);
	});
	it('same length', () => {
		expect(semverChapterSort('1.0', '1.1')).toBe(-1);
		expect(semverChapterSort('1.1', '1.0')).toBe(1);
		expect(semverChapterSort('1.0.1', '1.0.2')).toBe(-1);
		expect(semverChapterSort('1.0.2', '1.0.1')).toBe(1);
	});
});
