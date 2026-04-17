/**
 * Nordic Fund Day — Global Page Animations
 *
 * GSAP ScrollTrigger effects: hero parallax, section reveals, scroll pin,
 * counter animations, magnetic hover.
 *
 * Dependencies: gsap, gsap-scrolltrigger (loaded via functions.php)
 * Compiled to: dist/main.js
 */

( function () {
	'use strict';

	function init() {
		if ( typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' ) {
			return;
		}

		gsap.registerPlugin( ScrollTrigger );

		// ============================================================
		// NAV ENTRANCE ANIMATION
		// ============================================================
		const navBlock = document.querySelector( '[data-header-nav]' );
		if ( navBlock ) {
			gsap.set( navBlock, { y: -30, opacity: 0 } );
			gsap.to( navBlock, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' } );
		}

		// ============================================================
		// HERO — parallax scroll only (entrance handled by CSS)
		// ============================================================
		const heroBanner = document.querySelector( '[data-hero-banner]' );
		if ( heroBanner ) {
			const parallaxHero = heroBanner.querySelector( '.parallax-hero' );
			if ( parallaxHero && window.innerWidth >= 1024 ) {
				// Extend the div 25% above and below the container so the image
				// always covers the hero even when the parallax shift is applied.
				// Without this, a downward yPercent shift exposes the body background.
				parallaxHero.style.top = '-25%';
				parallaxHero.style.bottom = '-25%';

				gsap.fromTo( parallaxHero,
					{ yPercent: -8 },
					{
						yPercent: 8,
						ease: 'none',
						scrollTrigger: {
							trigger: heroBanner,
							start: 'top top',
							end: 'bottom top',
							scrub: true,
						},
					}
				);
			}
		}

		// ============================================================
		// SECTION REVEAL ANIMATIONS
		// ScrollTrigger.batch groups many elements into far fewer observers
		// ============================================================

		// Headings (h2, h3) fade-up
		const headings = Array.from( document.querySelectorAll( 'h2, h3' ) ).filter(
			( h ) => ! h.closest( '[data-hero-banner]' )
		);
		ScrollTrigger.batch( headings, {
			start: 'top 85%',
			onEnter: ( els ) => gsap.fromTo( els,
				{ y: 40, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 }
			),
			once: true,
		} );

		// Paragraphs fade-up (skip hero, footer, absolutely-positioned parents)
		const paragraphs = Array.from( document.querySelectorAll( 'section p' ) ).filter( ( p ) => {
			if ( p.closest( '[data-hero-banner]' ) ) return false;
			if ( p.closest( 'footer' ) ) return false;
			if ( window.getComputedStyle( p.parentElement ).position === 'absolute' ) return false;
			return true;
		} );
		ScrollTrigger.batch( paragraphs, {
			start: 'top 88%',
			onEnter: ( els ) => gsap.fromTo( els,
				{ y: 25, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.06 }
			),
			once: true,
		} );

		// Subtitle labels — slide from left
		const labels = Array.from( document.querySelectorAll( '.font-mono.uppercase' ) ).filter(
			( l ) => ! l.closest( '[data-hero-banner]' ) && ! l.closest( 'footer' )
		);
		ScrollTrigger.batch( labels, {
			start: 'top 90%',
			onEnter: ( els ) => gsap.fromTo( els,
				{ x: -20, opacity: 0 },
				{ x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.05 }
			),
			once: true,
		} );

		// CTA buttons — scale + fade up
		const ctaBtns = Array.from( document.querySelectorAll( 'a.rounded-full' ) ).filter(
			( b ) => ! b.closest( '[data-hero-banner]' ) && ! b.closest( '[data-header-nav]' )
		);
		ScrollTrigger.batch( ctaBtns, {
			start: 'top 90%',
			onEnter: ( els ) => gsap.fromTo( els,
				{ y: 20, opacity: 0, scale: 0.9 },
				{ y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07 }
			),
			once: true,
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

		// ============================================================
		// MAGNETIC HOVER EFFECT — rounded pill buttons
		// gsap.quickTo reuses one tween instead of creating a new one
		// on every mousemove event
		// ============================================================
		document.querySelectorAll( '.rounded-full' ).forEach( ( btn ) => {
			if ( btn.closest( '[data-header-nav]' ) ) return;
			if ( btn.closest( '.wp-block-nordic-fund-day-partner-cards' ) ) return;

			const xTo = gsap.quickTo( btn, 'x', { duration: 0.3, ease: 'power2.out' } );
			const yTo = gsap.quickTo( btn, 'y', { duration: 0.3, ease: 'power2.out' } );

			btn.addEventListener( 'mousemove', ( e ) => {
				const rect = btn.getBoundingClientRect();
				xTo( ( e.clientX - rect.left - rect.width / 2 ) * 0.15 );
				yTo( ( e.clientY - rect.top - rect.height / 2 ) * 0.15 );
			} );

			btn.addEventListener( 'mouseleave', () => {
				gsap.to( btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' } );
			} );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
