import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { subtitle, heading, description, ctaLabel, ctaUrl, ctaOpenInNewTab, cards } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'bg-black px-4 sm:px-6 md:px-16 lg:px-[90px] py-16 md:py-24 lg:py-[120px]',
	} );

	return (
		<section { ...blockProps }>
			<div className="flex flex-col lg:flex-row gap-12 lg:gap-12 xl:gap-16 items-start">
				{ /* Left Column */ }
				<div className="flex flex-col gap-10 lg:w-[34%] lg:flex-shrink-0">
					<div className="flex flex-col gap-5">
						<RichText.Content
							tagName="span"
							value={ subtitle }
							className="font-mono text-[14px] font-medium tracking-[0.1em] uppercase text-[var(--wp--preset--color--lime)]"
						/>
						<RichText.Content
							tagName="h2"
							value={ heading }
							className="text-white text-[36px] sm:text-[44px] md:text-[56px] lg:text-[56px] xl:text-[56px] font-bold leading-[1.05] uppercase"
						/>
					</div>
					<RichText.Content
						tagName="p"
						value={ description }
						className="font-mono text-[15px] sm:text-[16px] leading-[1.6] text-white max-w-[380px]"
					/>
					<a
						href={ ctaUrl || '#' }
						className="inline-flex items-center px-6 sm:px-10 py-3.5 sm:py-4 bg-[var(--wp--preset--color--lime-cta)] rounded-full text-black font-semibold text-[13px] sm:text-[16px] uppercase tracking-[0.02em] w-fit hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap"
						{ ...( ctaOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {} ) }
					>
						{ ctaLabel }
					</a>
				</div>

				{ /* Right Column — Partner Cards */ }
				<div className="flex flex-col sm:flex-row gap-5 flex-1">
					{ cards.map( ( card ) => {
						const isLime = card.labelColor === 'lime' || card.isPremium;
						const textColorClass = isLime ? 'text-[var(--wp--preset--color--lime)]' : 'text-white';

						return (
							<div key={ card.id } className="flex-1 bg-[var(--wp--preset--color--dark-card)] border border-white/[0.15] rounded-lg overflow-hidden">
								<div className="p-7 sm:p-8 border-b border-white/[0.15]">
									{ card.isPremium ? (
										<div className="flex items-start justify-between gap-4">
											<div className="flex flex-col gap-1">
												<span className={ `${ textColorClass } text-[15px] font-semibold` }>
													{ card.label }
												</span>
												<span className={ `${ textColorClass } text-[32px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.1] tracking-tight` }>
													{ card.price }
												</span>
											</div>
											{ card.badgeText && (
												<div className="inline-flex items-center px-5 py-2 bg-[var(--wp--preset--color--lime)]/[0.08] border border-[var(--wp--preset--color--lime)] rounded-full mt-2">
													<span className="text-[var(--wp--preset--color--lime)] text-[13px] font-semibold uppercase tracking-[0.1em]">
														{ card.badgeText }
													</span>
												</div>
											) }
										</div>
									) : (
										<>
											<span className={ `${ textColorClass } text-[15px] font-semibold` }>
												{ card.label }
											</span>
											<span className={ `${ textColorClass } text-[32px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.1] tracking-tight block mt-1` }>
												{ card.price }
											</span>
										</>
									) }
								</div>
								<div className="flex flex-col gap-5 p-7 sm:p-8">
									{ card.features.map( ( feature, fIdx ) => (
										<div key={ fIdx } className="flex items-start gap-3">
											<span className="text-white/50 text-[16px] mt-[1px]">→</span>
											<span className="text-white text-[16px] leading-[1.5]">{ feature.text }</span>
										</div>
									) ) }
								</div>
							</div>
						);
					} ) }
				</div>
			</div>
		</section>
	);
}
