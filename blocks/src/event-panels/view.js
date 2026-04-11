/**
 * Event Panels — Scroll pin effect
 *
 * Treasure Island stays pinned while Investor Brunch scrolls over it.
 * This view.js runs inside the wrapper block that contains both sections,
 * replicating the #event-panels container from the static HTML.
 */

function initEventPanels() {
	const panels = document.querySelectorAll( '[data-event-panels]' );

	panels.forEach( ( wrapper ) => {
		if ( typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' ) {
			return;
		}

		const treasureSection = wrapper.querySelector( '.wp-block-nordic-fund-day-treasure-mixer' );
		const brunchSection = wrapper.querySelector( '.wp-block-nordic-fund-day-investor-brunch' );

		if ( ! treasureSection || ! brunchSection ) return;

		// Only pin on desktop (lg+)
		if ( window.innerWidth < 1024 ) return;

		gsap.registerPlugin( ScrollTrigger );

		// Set z-indexes for proper layering
		treasureSection.style.zIndex = '1';
		brunchSection.style.position = 'relative';
		brunchSection.style.zIndex = '2';

		// Calculate how much the section overflows the viewport
		const overflow = Math.max( 0, treasureSection.offsetHeight - window.innerHeight );

		// Pin: starts after user has scrolled enough to see the full section
		ScrollTrigger.create( {
			trigger: wrapper,
			start: () => 'top -' + overflow + 'px',
			end: () => '+=' + brunchSection.offsetHeight,
			pin: treasureSection,
			pinSpacing: false,
			invalidateOnRefresh: true,
		} );
	} );
}

// Wait for GSAP to be available (loaded via CDN)
function waitForGsap() {
	if ( typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' ) {
		initEventPanels();
	} else {
		setTimeout( waitForGsap, 100 );
	}
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', waitForGsap );
} else {
	waitForGsap();
}
