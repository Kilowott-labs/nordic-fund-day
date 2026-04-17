/**
 * Logo marquee — infinite auto-scroll with no user controls.
 * Activates only when logos overflow the container width.
 * When logos fit, they stay centered with no animation.
 */

function initLogoMarquees() {
	document.querySelectorAll( '[data-logos-carousel]' ).forEach( ( carousel ) => {
		const track = carousel.querySelector( '[data-logos-track]' );
		if ( ! track ) return;

		let cloned = false;

		const setup = () => {
			// Remove previously cloned items before re-evaluating
			track.querySelectorAll( '[data-logo-clone]' ).forEach( ( el ) => el.remove() );
			track.classList.remove( 'logos-marquee-active' );
			track.style.animationPlayState = '';
			track.style.width = '';
			track.style.justifyContent = '';
			track.style.removeProperty( '--marquee-shift' );
			cloned = false;

			// Allow layout to settle before measuring
			requestAnimationFrame( () => {
				const overflows = track.scrollWidth > carousel.offsetWidth + 2;

				if ( ! overflows ) {
					// Logos fit — keep centered, no animation
					track.style.justifyContent = 'center';
					return;
				}

				// Measure natural content width before cloning
				track.style.justifyContent = 'flex-start';
				track.style.width = 'max-content';
				const originalWidth = track.offsetWidth;

				// Clone all logo items and append for seamless loop
				const originals = track.querySelectorAll( '[data-logo-item]' );
				originals.forEach( ( item ) => {
					const clone = item.cloneNode( true );
					clone.setAttribute( 'data-logo-clone', '' );
					clone.removeAttribute( 'data-logo-item' );
					clone.setAttribute( 'aria-hidden', 'true' );
					track.appendChild( clone );
				} );

				// Set exact shift distance so keyframe loops perfectly
				track.style.setProperty( '--marquee-shift', `${ originalWidth }px` );
				track.classList.add( 'logos-marquee-active' );
				cloned = true;
			} );
		};

		// Pause on hover for readability
		carousel.addEventListener( 'mouseenter', () => {
			if ( cloned ) track.style.animationPlayState = 'paused';
		} );
		carousel.addEventListener( 'mouseleave', () => {
			if ( cloned ) track.style.animationPlayState = 'running';
		} );

		setup();

		let resizeTimer;
		window.addEventListener( 'resize', () => {
			clearTimeout( resizeTimer );
			resizeTimer = setTimeout( setup, 150 );
		} );
	} );
}

// Use 'load' so image dimensions are known before measuring overflow
if ( document.readyState === 'complete' ) {
	initLogoMarquees();
} else {
	window.addEventListener( 'load', initLogoMarquees );
}
