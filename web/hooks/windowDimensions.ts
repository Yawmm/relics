import { useState, useEffect } from 'react';

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height
		};
	}

	useEffect(() => {
		window.addEventListener('resize', () => setWindowDimensions(getWindowDimensions()));
	}, []);

	return windowDimensions;
}