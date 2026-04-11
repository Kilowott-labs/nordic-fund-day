/**
 * Header Nav — Frontend interactivity
 * Handles: mobile menu toggle, smooth scroll for anchor links,
 * nav background change on scroll.
 */

function initHeaderNav() {
	const navBlocks = document.querySelectorAll( '[data-header-nav]' );

	navBlocks.forEach( ( nav ) => {
		const menuToggle = nav.querySelector( '[data-menu-toggle]' );
		const mobileMenu = nav.querySelector( '[data-mobile-menu]' );
		const hamburgerIcon = menuToggle?.querySelector( '.hamburger-icon' );
		const closeIcon = menuToggle?.querySelector( '.close-icon' );
		const navLinks = nav.querySelectorAll( '[data-nav-link]' );

		if ( ! menuToggle || ! mobileMenu ) return;

		// Mobile menu toggle with icon animation
		menuToggle.addEventListener( 'click', () => {
			const isOpen = mobileMenu.classList.toggle( 'open' );
			if ( hamburgerIcon ) {
				hamburgerIcon.style.opacity = isOpen ? '0' : '1';
				hamburgerIcon.style.transform = isOpen ? 'scale(0.75) rotate(45deg)' : 'scale(1) rotate(0)';
			}
			if ( closeIcon ) {
				closeIcon.style.opacity = isOpen ? '1' : '0';
				closeIcon.style.transform = isOpen ? 'scale(1) rotate(0)' : 'scale(0.75) rotate(-45deg)';
			}
		} );

		// Close mobile menu helper
		const closeMobileMenu = () => {
			mobileMenu.classList.remove( 'open' );
			if ( hamburgerIcon ) {
				hamburgerIcon.style.opacity = '1';
				hamburgerIcon.style.transform = 'scale(1) rotate(0)';
			}
			if ( closeIcon ) {
				closeIcon.style.opacity = '0';
				closeIcon.style.transform = 'scale(0.75) rotate(-45deg)';
			}
		};

		// Smooth scroll for anchor links + close mobile menu
		const allAnchors = nav.querySelectorAll( 'a[href^="#"]' );
		allAnchors.forEach( ( anchor ) => {
			anchor.addEventListener( 'click', ( e ) => {
				const targetId = anchor.getAttribute( 'href' );
				if ( ! targetId || targetId === '#' ) return;

				const target = document.querySelector( targetId );
				if ( target ) {
					e.preventDefault();
					closeMobileMenu();

					// Use Lenis if available, otherwise native smooth scroll
					if ( window.lenis ) {
						window.lenis.scrollTo( target, { offset: -90 } );
					} else {
						const top = target.getBoundingClientRect().top + window.scrollY - 90;
						window.scrollTo( { top, behavior: 'smooth' } );
					}
				}
			} );
		} );

		// Nav background on scroll — works with both native scroll and Lenis
		const handleScroll = () => {
			if ( window.scrollY > 50 ) {
				nav.classList.add( 'scrolled' );
			} else {
				nav.classList.remove( 'scrolled' );
			}
		};

		window.addEventListener( 'scroll', handleScroll, { passive: true } );

		// Also listen to Lenis scroll if available (Lenis may override native scroll)
		const checkLenis = setInterval( () => {
			if ( window.lenis ) {
				window.lenis.on( 'scroll', ( { scroll } ) => {
					if ( scroll > 50 ) {
						nav.classList.add( 'scrolled' );
					} else {
						nav.classList.remove( 'scrolled' );
					}
				} );
				clearInterval( checkLenis );
			}
		}, 100 );
		setTimeout( () => clearInterval( checkLenis ), 5000 ); // stop checking after 5s

		handleScroll(); // check initial state
	} );
}

// Initialize
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initHeaderNav );
} else {
	initHeaderNav();
}
