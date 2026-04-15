import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { backgroundImage, dateBadge, heading, description, buttons, stats, copyrightLeft, copyrightRight, kilowottUrl } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'relative overflow-hidden bg-cover bg-center bg-no-repeat bg-white',
		style: backgroundImage ? { backgroundImage: `url(${ backgroundImage })` } : undefined,
	} );

	return (
		<footer { ...blockProps }>
			{ /* Bottom gradient fade */ }
			<div className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

			{ /* Content */ }
			<div className="relative z-10 flex flex-col max-w-[861px] mx-auto pt-[80px] sm:pt-[100px] md:pt-[140px] px-4 sm:px-6">
				{ /* Heading group */ }
				<div className="flex flex-col gap-2">
					<div className="inline-flex items-center px-3 sm:px-4 h-[32px] rounded-full bg-white border border-black/20 w-fit">
						<span className="text-black text-[11px] sm:text-[14px] font-bold tracking-[0.1em] sm:tracking-[0.32em] uppercase whitespace-nowrap">
							{ dateBadge }
						</span>
					</div>
					<RichText.Content
						tagName="h2"
						value={ heading }
						className="text-black text-[56px] sm:text-[72px] md:text-[76px] lg:text-[80px] xl:text-[88px] min-[1600px]:text-[96px] font-black leading-[1] tracking-tight uppercase"
					/>
				</div>

				{ /* Description */ }
				<RichText.Content
					tagName="p"
					value={ description }
					className="font-mono text-[16px] leading-[1.6] max-w-[630px] mt-2"
					style={ { color: '#373737' } }
				/>

				{ /* CTA Buttons */ }
				<div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mt-[60px] sm:mt-[120px]">
					{ buttons.map( ( btn ) => {
						if ( btn.style === 'primary' ) {
							return (
								<a
									key={ btn.id }
									href={ btn.url || '#' }
									className="inline-flex items-center justify-center px-8 h-[48px] bg-[var(--wp--preset--color--lime)] border border-black/10 rounded-full text-black font-bold text-[14px] sm:text-[16px] tracking-[0.07em] uppercase hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap"
								>
									{ btn.label }
								</a>
							);
						}
						return (
							<a
								key={ btn.id }
								href={ btn.url || '#' }
								className="inline-flex items-center justify-center px-8 h-[48px] bg-white/10 backdrop-blur-md border border-white/40 rounded-full text-white font-bold text-[14px] sm:text-[16px] tracking-[0.07em] uppercase hover:bg-[var(--wp--preset--color--lime)] hover:text-black hover:border-[var(--wp--preset--color--lime)] transition-all duration-300 whitespace-nowrap"
							>
								{ btn.label }
							</a>
						);
					} ) }
				</div>

				{ /* Stats row */ }
				<div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6 mt-4 font-mono font-medium">
					{ stats.map( ( stat, idx ) => (
						<>
							{ idx > 0 && (
								<span key={ `sep-${ stat.id }` } className="text-white/40 text-[10px]">•</span>
							) }
							<span key={ stat.id } className="text-white text-[13px] tracking-[0.1em] uppercase">
								{ stat.text }
							</span>
						</>
					) ) }
				</div>

				{ /* Spacer */ }
				<div className="h-[100px] sm:h-[140px] md:h-[193px]"></div>
			</div>

			{ /* Copyright bar */ }
			<div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 md:left-[90px] right-4 sm:right-6 md:right-[90px] flex flex-col sm:flex-row items-center sm:items-center justify-between gap-1 text-center sm:text-left z-20">
				<span className="font-mono text-[10px] sm:text-[12px] font-medium" style={ { color: 'rgba(255,255,255,0.8)' } }>
					{ copyrightLeft }
				</span>
				<a href={ kilowottUrl } className="font-mono text-[10px] sm:text-[12px] font-medium hover:underline" style={ { color: 'rgba(255,255,255,0.8)' } }>
					{ copyrightRight }
				</a>
			</div>
		</footer>
	);
}
