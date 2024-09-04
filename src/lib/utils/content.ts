import type { ChapterSection } from '$lib/components/editor/content-types';
import { max } from 'lodash-es';

export const sectionedToRaw = (s: ChapterSection[]) => {
	const sourceLines: string[] = [];
	const translatedLines: string[] = [];
	s.forEach((x) => {
		sourceLines.push(x.source);
		translatedLines.push(x.translated);
	});
	return {
		source: sourceLines.join('\n\n'),
		translated: translatedLines.join('\n\n')
	};
};

export const rawToSectioned = (s: ChapterSection) => {
	const sections: ChapterSection[] = [];
	const sourceSplit = s.source.split('\n');
	const targetSplit = s.translated.split('\n');
	if (sourceSplit.length < targetSplit.length) {
		for (let i = 0; i < targetSplit.length - sourceSplit.length; ++i) {
			sourceSplit.push('');
		}
	} else if (sourceSplit.length > targetSplit.length) {
		for (let i = 0; i < sourceSplit.length - targetSplit.length; ++i) {
			targetSplit.push('');
		}
	}

	for (let i = 0; i < sourceSplit.length; ++i) {
		sections.push({ source: sourceSplit[i], translated: targetSplit[i] });
	}
	return sections;
};

export const semverChapterSort = (l: string, r: string) => {
	const lt = l.split('.').filter((x) => x);
	const rt = r.split('.').filter((x) => x);
	for (let i = 0; i < Math.min(lt.length, r.length); i++) {
		const lv = parseInt(lt[i]);
		const rv = parseInt(rt[i]);
		if (lv < rv) return -1;
		if (rv < lv) return 1;
	}
	return lt.length === rt.length ? 0 : lt.length < rt.length ? -1 : 1;
};
