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
		// HERO — CSS handles entrance animations (no JS delay).
		// GSAP only handles parallax scroll effect.
		// ============================================================
		const heroBanner = document.querySelector( '[data-hero-banner]' );
		if ( heroBanner ) {
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
		const scheduleBlock = document.querySelector( '.wp-block-nordic-fund-day-schedule-grid' );
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
		const partnerBlock = document.querySelector( '.wp-block-nordic-fund-day-partner-cards' );
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
		const pitchBlock = document.querySelector( '.wp-block-nordic-fund-day-pitch-showcase' );
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
		document.querySelectorAll( '.wp-block-nordic-fund-day-treasure-mixer .rounded, .wp-block-nordic-fund-day-investor-brunch .rounded' ).forEach( ( badge, i ) => {
			gsap.fromTo( badge,
				{ x: -30, opacity: 0 },
				{
					x: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: 'power2.out',
					scrollTrigger: { trigger: badge, start: 'top 88%', toggleActions: 'play none none none' },
				}
			);
		} );

		// Value proposition image reveal — clipPath wipe
		const vpBlock = document.querySelector( '.wp-block-nordic-fund-day-value-proposition' );
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

		// FOOTER CTA — parallax removed per designer feedback

		// ============================================================
		// MAGNETIC HOVER EFFECT — all rounded pill buttons
		// Buttons follow mouse slightly, snap back with elastic ease
		// ============================================================
		document.querySelectorAll( '.rounded-full' ).forEach( ( btn ) => {
			if ( btn.closest( '[data-header-nav]' ) ) return;

			btn.addEventListener( 'mousemove', ( e ) => {
				const rect = btn.getBoundingClientRect();
				const x = e.clientX - rect.left - rect.width / 2;
				const y = e.clientY - rect.top - rect.height / 2;
				gsap.to( btn, { x: x * 0.15, y: y * 0.15, duration: 0.3, ease: 'power2.out' } );
			} );

			btn.addEventListener( 'mouseleave', () => {
				gsap.to( btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' } );
			} );
		} );
	}

	// Initialize when DOM is ready
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
