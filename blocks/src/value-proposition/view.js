/**
 * Logo carousel — activates only when logos overflow the container.
 * Uses CSS translateX (no native scroll) so no scrollbar ever appears.
 * When logos fit, they stay centered with no carousel controls.
 */

function initLogoCarousels() {
	document.querySelectorAll( '[data-logos-carousel]' ).forEach( ( carousel ) => {
		const track = carousel.querySelector( '[data-logos-track]' );
		if ( ! track ) return;

		let offset = 0;
		let prevBtn = null;
		let nextBtn = null;

		const getMax = () => Math.max( 0, track.scrollWidth - carousel.offsetWidth );

		const slide = ( newOffset ) => {
			offset = Math.max( 0, Math.min( newOffset, getMax() ) );
			track.style.transform = `translateX(-${ offset }px)`;
			syncButtons();
		};

		const syncButtons = () => {
			if ( ! prevBtn || ! nextBtn ) return;
			prevBtn.style.opacity = offset <= 0 ? '0' : '1';
			prevBtn.style.pointerEvents = offset <= 0 ? 'none' : 'auto';
			nextBtn.style.opacity = offset >= getMax() - 1 ? '0' : '1';
			nextBtn.style.pointerEvents = offset >= getMax() - 1 ? 'none' : 'auto';
		};

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
				'width:32px',
				'height:32px',
				'display:flex',
				'align-items:center',
				'justify-content:center',
				'border-radius:9999px',
				'border:none',
				'cursor:pointer',
				'background:rgba(255,255,255,0.12)',
				'color:#fff',
				'transition:opacity 0.2s, background 0.2s',
			].join( ';' );
			b.innerHTML = dir === 'prev'
				? '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>'
				: '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>';
			b.addEventListener( 'mouseenter', () => { b.style.background = 'rgba(255,255,255,0.22)'; } );
			b.addEventListener( 'mouseleave', () => { b.style.background = 'rgba(255,255,255,0.12)'; } );
			return b;
		};

		const setup = () => {
			// Reset state
			carousel.querySelectorAll( '[data-logo-nav]' ).forEach( ( b ) => b.remove() );
			prevBtn = null;
			nextBtn = null;
			offset = 0;
			track.style.transform = '';
			track.style.justifyContent = '';

			if ( track.scrollWidth <= carousel.offsetWidth + 2 ) {
				// All logos fit — stay centered, no carousel
				return;
			}

			// Logos overflow — activate carousel, align from start so first logo is visible
			track.style.justifyContent = 'flex-start';
			track.style.transform = 'translateX(0)';

			const STEP = Math.round( carousel.offsetWidth * 0.6 );

			prevBtn = makeBtn( 'prev' );
			nextBtn = makeBtn( 'next' );

			prevBtn.addEventListener( 'click', () => slide( offset - STEP ) );
			nextBtn.addEventListener( 'click', () => slide( offset + STEP ) );

			carousel.appendChild( prevBtn );
			carousel.appendChild( nextBtn );

			syncButtons();
		};

		setup();

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
