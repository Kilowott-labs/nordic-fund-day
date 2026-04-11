/**
 * Nordic Fund Day — Global Page Animations
 *
 * Initializes Lenis smooth scroll, GSAP ScrollTrigger effects,
 * hero parallax, treasure island pin, and section reveal animations.
 *
 * Dependencies: gsap, gsap-scrolltrigger, lenis (loaded via functions.php)
 * Compiled to: dist/main.js
 */

( function () {
	'use strict';

	// Wait for DOM + all scripts to load
	function init() {
		if ( typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined' ) {
			return;
		}

		// ============================================================
		// LENIS SMOOTH SCROLL
		// ============================================================
		const lenis = new Lenis( {
			duration: 1.2,
			easing: ( t ) => Math.min( 1, 1.001 - Math.pow( 2, -10 * t ) ),
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
		} );

		// Expose globally for header-nav view.js to use
		window.lenis = lenis;

		function raf( time ) {
			lenis.raf( time );
			requestAnimationFrame( raf );
		}
		requestAnimationFrame( raf );

		// ============================================================
		// GSAP REGISTER (must be before any ScrollTrigger usage)
		// ============================================================
		gsap.registerPlugin( ScrollTrigger );

		// Connect Lenis to GSAP ScrollTrigger
		lenis.on( 'scroll', ScrollTrigger.update );
		gsap.ticker.add( ( time ) => {
			lenis.raf( time * 1000 );
		} );
		gsap.ticker.lagSmoothing( 0 );

		// ============================================================
		// NAV ENTRANCE ANIMATION
		// ============================================================
		const navBlock = document.querySelector( '[data-header-nav]' );
		if ( navBlock ) {
			gsap.set( navBlock, { y: -30, opacity: 0 } );
			gsap.to( navBlock, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' } );
		}

		// ============================================================
		// HERO ENTRANCE ANIMATIONS
		// ============================================================
		const heroBanner = document.querySelector( '[data-hero-banner]' );
		if ( heroBanner ) {
			// Set transform positions (opacity:0 already inline in HTML)
			gsap.set( '[data-hero-badge]', { y: 20, scale: 0.9 } );
			gsap.set( '[data-hero-title]', { y: 80 } );
			gsap.set( '[data-hero-cta]', { y: 30 } );
			gsap.set( '[data-hero-bottom]', { y: 50 } );

			const heroTL = gsap.timeline( { delay: 0.3 } );
			heroTL
				.to( '[data-hero-badge]', { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' } )
				.to( '[data-hero-title]', { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15 }, '-=0.3' )
				.to( '[data-hero-cta]', { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3' )
				.to( '[data-hero-bottom]', { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.2' );

			// Hero parallax — desktop only to avoid mobile jerk
			const parallaxHero = heroBanner.querySelector( '.parallax-hero' );
			if ( parallaxHero && window.innerWidth >= 1024 ) {
				gsap.to( parallaxHero, {
					yPercent: 15,
					ease: 'none',
					scrollTrigger: {
						trigger: heroBanner,
						start: 'top top',
						end: 'bottom top',
						scrub: true,
					},
				} );
			}
		}

		// ============================================================
		// SECTION REVEAL ANIMATIONS
		// Matches the static reference page animations exactly
		// ============================================================

		// Headings (h2, h3) fade-up
		document.querySelectorAll( 'h2, h3' ).forEach( ( h ) => {
			if ( h.closest( '[data-hero-banner]' ) ) return;
			gsap.fromTo( h,
				{ y: 40, opacity: 0 },
				{
					y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
					scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none none' },
				}
			);
		} );

		// Paragraphs fade-up (skip hero, footer, absolute)
		document.querySelectorAll( 'section p' ).forEach( ( p ) => {
			if ( p.closest( '[data-hero-banner]' ) ) return;
			if ( p.closest( 'footer' ) ) return;
			if ( window.getComputedStyle( p.parentElement ).position === 'absolute' ) return;
			gsap.fromTo( p,
				{ y: 25, opacity: 0 },
				{
					y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
					scrollTrigger: { trigger: p, start: 'top 88%', toggleActions: 'play none none none' },
				}
			);
		} );

		// Subtitle labels (✦ text) — slide from left
		document.querySelectorAll( '.font-mono.uppercase' ).forEach( ( label ) => {
			if ( label.closest( '[data-hero-banner]' ) ) return;
			if ( label.closest( 'footer' ) ) return;
			gsap.fromTo( label,
				{ x: -20, opacity: 0 },
				{
					x: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
					scrollTrigger: { trigger: label, start: 'top 90%', toggleActions: 'play none none none' },
				}
			);
		} );

		// CTA buttons — scale + fade up
		document.querySelectorAll( 'a.rounded-full' ).forEach( ( btn ) => {
			if ( btn.closest( '[data-hero-banner]' ) ) return;
			if ( btn.closest( '[data-header-nav]' ) ) return;
			gsap.fromTo( btn,
				{ y: 20, opacity: 0, scale: 0.9 },
				{
					y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out',
					scrollTrigger: { trigger: btn, start: 'top 90%', toggleActions: 'play none none none' },
				}
			);
		} );

		// Schedule day cards — stagger
		const scheduleBlock = document.querySelector( '.wp-block-agent-theme-schedule-grid' );
		if ( scheduleBlock ) {
			scheduleBlock.querySelectorAll( '.rounded-lg' ).forEach( ( card, i ) => {
				gsap.fromTo( card,
					{ y: 60, opacity: 0 },
					{
						y: 0, opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
						scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
					}
				);
			} );
		}

		// Partner cards — stagger with scale
		const partnerBlock = document.querySelector( '.wp-block-agent-theme-partner-cards' );
		if ( partnerBlock ) {
			partnerBlock.querySelectorAll( '.rounded-lg' ).forEach( ( card, i ) => {
				gsap.fromTo( card,
					{ y: 50, opacity: 0, scale: 0.96 },
					{
						y: 0, opacity: 1, scale: 1, duration: 0.9, delay: i * 0.2, ease: 'power3.out',
						scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
					}
				);
			} );
		}

		// Pitch sector cards — stagger with scale
		const pitchBlock = document.querySelector( '.wp-block-agent-theme-pitch-showcase' );
		if ( pitchBlock ) {
			pitchBlock.querySelectorAll( '.rounded-\\[5px\\]' ).forEach( ( card, i ) => {
				gsap.fromTo( card,
					{ y: 40, opacity: 0, scale: 0.95 },
					{
						y: 0, opacity: 1, scale: 1, duration: 0.7, delay: i * 0.08, ease: 'power2.out',
						scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
					}
				);
			} );
		}

		// Feature badges (treasure, brunch) — stagger
		document.querySelectorAll( '.wp-block-agent-theme-treasure-mixer .rounded, .wp-block-agent-theme-investor-brunch .rounded' ).forEach( ( badge, i ) => {
			gsap.fromTo( badge,
				{ x: -30, opacity: 0 },
				{
					x: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: 'power2.out',
					scrollTrigger: { trigger: badge, start: 'top 88%', toggleActions: 'play none none none' },
				}
			);
		} );

		// Value proposition image reveal — clipPath wipe
		const vpBlock = document.querySelector( '.wp-block-agent-theme-value-proposition' );
		if ( vpBlock ) {
			const imgContainer = vpBlock.querySelector( '.overflow-hidden.self-start' );
			if ( imgContainer ) {
				gsap.fromTo( imgContainer,
					{ clipPath: 'inset(0 100% 0 0)' },
					{
						clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut',
						scrollTrigger: { trigger: imgContainer, start: 'top 70%', toggleActions: 'play none none none' },
					}
				);
			}
		}

		// ============================================================
		// TREASURE ISLAND + INVESTOR BRUNCH — SCROLL PIN
		// Handled by event-panels wrapper block's own view.js
		// ============================================================

		// ============================================================
		// STATS COUNTER ANIMATION (Hero bottom)
		// ============================================================
		document.querySelectorAll( '[data-hero-bottom] .font-mono' ).forEach( ( stat ) => {
			const originalText = stat.textContent;
			const match = originalText.match( /^(\d+)(.*)$/ );
			if ( match ) {
				const target = parseInt( match[ 1 ], 10 );
				const suffix = match[ 2 ];
				const counter = { val: 0 };

				ScrollTrigger.create( {
					trigger: stat,
					start: 'top 90%',
					once: true,
					onEnter: () => {
						gsap.to( counter, {
							val: target,
							duration: 1.5,
							ease: 'power1.out',
							onUpdate: () => {
								stat.textContent = Math.round( counter.val ) + suffix;
							},
						} );
					},
				} );
			}
		} );
	}

	// Initialize when DOM is ready
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
