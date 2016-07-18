//Make sure the bottom is above the tool bar
const BOTTOM_PADDING = 70;

function getMinTop () {
	return 10;
}

//Account for the dialog buttons that will be there.
function adjustHeight (height) {
	return height + 40;
}

function getMaxHeight (viewHeight) {
	const minTop = getMinTop();

	return viewHeight - minTop - BOTTOM_PADDING;
}


export function getScrollOffsetForRect ({top, height}, viewportHeight) {
	top = Math.floor(top);
	height = Math.floor(height);

	const minTop = getMinTop();
	const adjustedHeight = adjustHeight(height);
	const maxHeight = getMaxHeight(viewportHeight);
	let offset = 0;


	//If its too tall to completely fit on screen position it at the top
	//and let it scroll
	if (adjustedHeight > maxHeight) {
		offset = top - minTop;
	//If its not too tall but partly above the top, position at the top
	} else if (top < minTop) {
		offset = top - minTop;
	//if its not too tall but partly below the top, move it up so the bottom show
	} else if (top + adjustedHeight > maxHeight) {
		offset = (top + adjustedHeight) - maxHeight;
	}
	//If none of these conditions are met the entirety is visible on the screen
	//so don't move it at all


	return offset;
}

export function getDialogPositionForRect (rect) {
	return {
		top: Math.floor(rect.top),
		height: Math.floor(rect.height)
	};
}
