/**
 * Logo carousel — activates only when logos overflow the track width.
 * Uses native scroll + injected prev/next buttons so no dependencies needed.
 */

function initLogoCarousels() {
	document.querySelectorAll( '[data-logos-carousel]' ).forEach( ( carousel ) => {
		const track = carousel.querySelector( '[data-logos-track]' );
		if ( ! track ) return;

		// Re-check on resize in case viewport changes
		const setup = () => {
			const overflows = track.scrollWidth > track.clientWidth + 2;

			// Remove existing buttons before re-evaluating
			carousel.querySelectorAll( '[data-logo-nav]' ).forEach( ( b ) => b.remove() );

			if ( ! overflows ) return;

			const makeBtn = ( dir ) => {
				const b = document.createElement( 'button' );
				b.setAttribute( 'aria-label', dir === 'prev' ? 'Previous logos' : 'Next logos' );
				b.setAttribute( 'data-logo-nav', dir );
				b.setAttribute( 'type', 'button' );
				b.style.cssText = [
					'position:absolute',
					'top:50%',
					'transform:translateY(-50%)',
					dir === 'prev' ? 'left:0' : 'right:0',
					'z-index:10',
					'width:36px',
					'height:36px',
					'display:flex',
					'align-items:center',
					'justify-content:center',
					'border-radius:9999px',
					'border:none',
					'cursor:pointer',
					'background:rgba(255,255,255,0.1)',
					'color:#fff',
					'transition:background 0.2s',
				].join( ';' );

				b.innerHTML = dir === 'prev'
					? '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>'
					: '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';

				b.addEventListener( 'mouseenter', () => { b.style.background = 'rgba(255,255,255,0.2)'; } );
				b.addEventListener( 'mouseleave', () => { b.style.background = 'rgba(255,255,255,0.1)'; } );
				return b;
			};

			const STEP = 280;
			const prevBtn = makeBtn( 'prev' );
			const nextBtn = makeBtn( 'next' );

			prevBtn.addEventListener( 'click', () => track.scrollBy( { left: -STEP, behavior: 'smooth' } ) );
			nextBtn.addEventListener( 'click', () => track.scrollBy( { left: STEP, behavior: 'smooth' } ) );

			carousel.style.position = 'relative';
			carousel.appendChild( prevBtn );
			carousel.appendChild( nextBtn );

			const syncButtons = () => {
				const atStart = track.scrollLeft <= 1;
				const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
				prevBtn.style.opacity = atStart ? '0' : '1';
				prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
				nextBtn.style.opacity = atEnd ? '0' : '1';
				nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
			};

			track.addEventListener( 'scroll', syncButtons, { passive: true } );
			syncButtons();
		};

		setup();

		// Re-evaluate on resize with debounce
		let resizeTimer;
		window.addEventListener( 'resize', () => {
			clearTimeout( resizeTimer );
			resizeTimer = setTimeout( setup, 150 );
		} );
	} );
}

document.readyState === 'loading'
	? document.addEventListener( 'DOMContentLoaded', initLogoCarousels )
	: initLogoCarousels();
