import { InputRule } from '@milkdown/kit/prose/inputrules';
import { TextSelection, EditorState, Transaction } from '@milkdown/kit/prose/state';
import { $inputRule } from '@milkdown/kit/utils';

const forward = (t: Transaction, pos: number, d = 1) => {
	const newPos = t.doc.resolve(pos + d);
	const newSel = new TextSelection(newPos, newPos);
	return t.setSelection(newSel);
};

const insertMatching = (state: EditorState, brackets: string) => {
	const sel = state.selection;
	if (sel instanceof TextSelection) {
		const pos = sel.$cursor?.pos;
		if (!pos) {
			return null;
		}
		const trans = state.tr.insertText(brackets, pos, pos);
		return forward(trans, pos, 1);
	}
	return null;
};

const skipClosing = (state: EditorState, bracket: string) => {
	const sel = state.selection;
	if (sel instanceof TextSelection) {
		const pos = sel.$cursor?.pos;
		if (!pos) {
			return null;
		}
		const nextCharPos = state.doc.resolve(pos);
		const nextCharOffset = nextCharPos.textOffset;
		// end of paragraph
		if (nextCharOffset === 0 && nextCharPos.parentOffset !== 0) {
			return null;
		}
		const nextChar = nextCharPos.parent.textContent[nextCharOffset];
		if (nextChar === bracket) {
			return forward(state.tr.setMeta('addToHistory', false), pos, 1);
		} else {
			return null;
		}
	}
	return null;
};

const openParenthesisInputRule = $inputRule(() => {
	return new InputRule(/\($/, (state, match, start, end) => {
		return insertMatching(state, '()');
	});
});

const openBracketInputRule = $inputRule(() => {
	return new InputRule(/\[$/, (state, match, start, end) => {
		return insertMatching(state, '[]');
	});
});

const closeParenthesisInputRule = $inputRule(() => {
	return new InputRule(
		/\)/,
		(state, match, start, end) => {
			return skipClosing(state, ')');
		},
		{ undoable: false }
	);
});

const closeBracketInputRule = $inputRule(() => {
	return new InputRule(
		/\)/,
		(state, match, start, end) => {
			return skipClosing(state, ']');
		},
		{ undoable: false }
	);
});

export const brackets = [
	openParenthesisInputRule,
	openBracketInputRule,
	closeParenthesisInputRule,
	closeBracketInputRule
];
