export const randomId = () => {
	return '_' + Math.random().toString(36).slice(2);
};

type Box = { x: number; y: number; width: number; height: number };

const getPosition = (e: HTMLElement) => {
	const x = e.offsetLeft;
	const y = e.offsetTop;
	const { width, height } = e.getBoundingClientRect();
	return { x, y, width, height };
};

export const animateChildChanges = (e: HTMLElement, options = { duration: 5000 }) => {
	const setBox = (box: Box, initial = false) => {
		e.style.transform = `translate(${box.x}px,${box.y}px)`;
		if (!initial) {
			e.style.width = `${box.width}px`;
			e.style.height = `${box.height}px`;
		} else {
			e.style.transitionProperty = 'none';
			e.style.removeProperty('width');
			e.style.removeProperty('height');
		}
	};
	const observeOptions = { childList: true, subtree: true, attributes: true };
	const { duration } = options;
	let oldBox = getPosition(e);
	console.log(oldBox);
	setBox(oldBox, true);

	const observer = new MutationObserver((_, o) => {
		o.disconnect();
		const newBox = getPosition(e);
		setBox(oldBox);
		console.log('old', oldBox);

		e.style.removeProperty('transition-property');
		setBox(newBox);
		console.log('new', newBox);

		setTimeout(() => {
			setBox(newBox, true);
			oldBox = newBox;
			o.observe(e, observeOptions);
		}, duration);
	});
	observer.observe(e, observeOptions);
};

export const animateLayoutChanges = (e: HTMLElement) => {
	const { width, height } = e.getBoundingClientRect();
	e.style.setProperty('width', `${width}px`);
	e.style.setProperty('height', `${height}px`);
	let running = false;

	const observer = new MutationObserver(() => {
		if (running) return;
		running = true;
		// original dims
		const { width, height } = e.getBoundingClientRect();

		const ro1 = new ResizeObserver((_, o1) => {
			o1.disconnect();
			// new dims
			const { width: newWidth, height: newHeight } = e.getBoundingClientRect();
			e.style.setProperty('width', `${width}px`);
			e.style.setProperty('height', `${height}px`);

			const ro2 = new ResizeObserver((_, o2) => {
				o2.disconnect();
				e.style.setProperty('width', `${newWidth}px`);
				e.style.setProperty('height', `${newHeight}px`);
				running = false;
			});
			ro2.observe(e);
		});
		ro1.observe(e);

		e.style.removeProperty('width');
		e.style.removeProperty('height');
	});
	observer.observe(e, { childList: true, subtree: true });
};
