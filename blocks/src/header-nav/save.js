import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { logo, logoAlt, navLinks, ctaLabel, ctaUrl } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'fixed top-0 left-0 right-0 z-50',
	} );

	return (
		<nav { ...blockProps } data-header-nav="">
			<div className="flex items-center justify-between px-4 sm:px-6 md:px-[90px] py-[13px]">
				{ /* Logo */ }
				<div className="flex-shrink-0">
					{ logo ? (
						<img src={ logo } alt={ logoAlt } className="h-[40px] sm:h-[52px] md:h-[64px] w-auto" />
					) : (
						<span className="text-white text-xl font-bold">{ logoAlt }</span>
					) }
				</div>

				{ /* Desktop Nav Links */ }
				<div className="hidden md:flex items-center gap-[43px]">
					{ navLinks.map( ( link ) => (
						<a
							key={ link.id }
							href={ link.url || '#' }
							className="text-white text-lg font-bold hover:text-[var(--wp--preset--color--lime)] transition-colors"
							data-nav-link=""
						>
							{ link.label }
						</a>
					) ) }
					<a
						href={ ctaUrl || '#' }
						className="inline-flex items-center justify-center px-[19px] py-[9px] bg-white rounded-full text-black text-base font-bold uppercase tracking-[0.05em] hover:bg-[var(--wp--preset--color--lime)] hover:text-black transition-all duration-300"
					>
						{ ctaLabel }
					</a>
				</div>

				{ /* Mobile Menu Button */ }
				<button
					className="md:hidden text-white relative w-[28px] h-[28px]"
					aria-label="Toggle menu"
					data-menu-toggle=""
				>
					<svg className="hamburger-icon transition-all duration-300" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M4 7h20M4 14h20M4 21h20" />
					</svg>
					<svg className="close-icon absolute inset-0 transition-all duration-300 opacity-0 scale-75" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M6 6l16 16M22 6L6 22" />
					</svg>
				</button>
			</div>

			{ /* Mobile Menu */ }
			<div className="mobile-menu flex-col gap-4 px-4 bg-black/95 backdrop-blur-md md:hidden" data-mobile-menu="">
				{ navLinks.map( ( link ) => (
					<a
						key={ link.id }
						href={ link.url || '#' }
						className="text-white text-[18px] font-bold py-3 border-b border-white/10"
						data-nav-link=""
					>
						{ link.label }
					</a>
				) ) }
				<a
					href={ ctaUrl || '#' }
					className="inline-flex items-center justify-center w-full px-5 py-3.5 bg-white rounded-full text-black text-sm font-bold uppercase tracking-wide mt-3"
				>
					{ ctaLabel }
				</a>
			</div>
		</nav>
	);
}
