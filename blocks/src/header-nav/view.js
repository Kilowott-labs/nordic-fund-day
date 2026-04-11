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

		// Logo click — scroll to top
		const scrollTopBtn = nav.querySelector( '[data-scroll-top]' );
		if ( scrollTopBtn ) {
			scrollTopBtn.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				if ( window.lenis ) {
					window.lenis.scrollTo( 0 );
				} else {
					window.scrollTo( { top: 0, behavior: 'smooth' } );
				}
			} );
		}

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

		// Smart sticky nav: visible at top + on scroll-up, hidden on scroll-down
		let lastScroll = 0;
		let navHidden = false;

		const updateNav = ( scroll ) => {
			// Always visible at top of page
			if ( scroll <= 50 ) {
				nav.classList.remove( 'scrolled', 'nav-hidden' );
				navHidden = false;
				lastScroll = scroll;
				return;
			}

			// Add dark background when past hero
			nav.classList.add( 'scrolled' );

			const delta = scroll - lastScroll;

			// Scrolling DOWN — hide nav
			if ( delta > 5 && ! navHidden ) {
				nav.classList.add( 'nav-hidden' );
				navHidden = true;
			}

			// Scrolling UP — show nav
			if ( delta < -5 && navHidden ) {
				nav.classList.remove( 'nav-hidden' );
				navHidden = false;
			}

			lastScroll = scroll;
		};

		// Listen to native scroll
		window.addEventListener( 'scroll', () => updateNav( window.scrollY ), { passive: true } );

		// Also listen to Lenis if available
		const checkLenis = setInterval( () => {
			if ( window.lenis ) {
				window.lenis.on( 'scroll', ( { scroll } ) => updateNav( scroll ) );
				clearInterval( checkLenis );
			}
		}, 100 );
		setTimeout( () => clearInterval( checkLenis ), 5000 );

		updateNav( window.scrollY ); // check initial state
	} );
}

// Initialize
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initHeaderNav );
} else {
	initHeaderNav();
}
