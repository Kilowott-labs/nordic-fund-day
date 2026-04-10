/**
 * Frontend interactivity for the coretrek/banner-text block.
 *
 * Supports multiple independent block instances on the same page.
 * Matches the exact behaviour from the original banner-text.html prototype.
 */

function initBannerText( block ) {
	const collectionItems = block.querySelectorAll( '.collection-item' );
	const mainImage = block.querySelector( '[data-banner-image]' );
	const seasonLabel = block.querySelector( '[data-banner-season-label]' );
	const desc1El = block.querySelector( '[data-banner-desc1]' );
	const desc2El = block.querySelector( '[data-banner-desc2]' );
	const ctaEl = block.querySelector( '[data-banner-cta]' );

	if ( ! collectionItems.length ) return;

	// Read colour constants from the first item's data attributes
	// (stored there by save.js so no PHP is needed)
	const firstItem = collectionItems[ 0 ];
	const ACTIVE_COLOR = firstItem.dataset.activeColor || '#604683';
	const INACTIVE_COLOR = firstItem.dataset.inactiveColor || '#e3b5bb';

	function activateItem( target ) {
		// Reset all items to inactive
		collectionItems.forEach( function ( item ) {
			item.classList.remove( 'active' );
			item.setAttribute( 'aria-pressed', 'false' );

			const iconPath = item.querySelector( '.collection-icon path' );
			const title = item.querySelector( '.collection-title' );
			const subtitle = item.querySelector( '.collection-subtitle' );

			if ( iconPath ) iconPath.setAttribute( 'fill', INACTIVE_COLOR );
			if ( title ) title.style.color = INACTIVE_COLOR;
			if ( subtitle ) subtitle.style.color = INACTIVE_COLOR;
		} );

		// Activate the selected item
		target.classList.add( 'active' );
		target.setAttribute( 'aria-pressed', 'true' );

		const iconPath = target.querySelector( '.collection-icon path' );
		const title = target.querySelector( '.collection-title' );
		const subtitle = target.querySelector( '.collection-subtitle' );

		if ( iconPath ) iconPath.setAttribute( 'fill', ACTIVE_COLOR );
		if ( title ) title.style.color = ACTIVE_COLOR;
		if ( subtitle ) subtitle.style.color = ACTIVE_COLOR;

		// Pull content from data attributes
		const imageUrl = target.dataset.image;
		const season = target.dataset.season;
		const description1 = target.dataset.desc1;
		const description2 = target.dataset.desc2;
		const buttonText = target.dataset.button;
		const buttonUrl = target.dataset.buttonUrl || '#';
		const titleText = title ? title.textContent : '';

		// Cross-fade the main image
		if ( mainImage ) {
			mainImage.style.opacity = '0';
			setTimeout( function () {
				if ( imageUrl ) {
					mainImage.src = imageUrl;
					mainImage.alt = titleText;
				}
				mainImage.style.opacity = '1';
			}, 500 );
		}

		// Update the text content section
		if ( seasonLabel ) seasonLabel.textContent = season;
		if ( desc1El ) desc1El.textContent = description1;
		if ( desc2El ) desc2El.textContent = description2;

		if ( ctaEl ) {
			ctaEl.textContent = buttonText;
			ctaEl.href = buttonUrl;
		}
	}

	collectionItems.forEach( function ( item ) {
		// Click handler
		item.addEventListener( 'click', function () {
			activateItem( this );
		} );

		// Keyboard: Enter / Space
		item.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'Enter' || e.key === ' ' ) {
				e.preventDefault();
				activateItem( this );
			}
		} );
	} );
}

// Initialise all banner-text blocks on the page
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', function () {
		document
			.querySelectorAll( '[data-banner-text]' )
			.forEach( initBannerText );
	} );
} else {
	document
		.querySelectorAll( '[data-banner-text]' )
		.forEach( initBannerText );
}
