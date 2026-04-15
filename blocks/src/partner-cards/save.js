import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { subtitle, heading, description, ctaLabel, ctaUrl, ctaOpenInNewTab, contactImage, contactName, contactTitle, contactCompany, contactEmail, contactPhone } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'bg-black px-4 sm:px-6 md:px-16 lg:px-[90px] py-16 md:py-24 lg:py-[120px]',
		id: 'partner',
	} );

	return (
		<section { ...blockProps }>
			<div className="flex flex-col lg:flex-row gap-12 lg:gap-12 xl:gap-16 lg:items-stretch">
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

				{ /* Right Column — Contact Card */ }
				<div className="flex flex-col sm:flex-row gap-5 flex-1">
					<div className="flex-1 bg-[var(--wp--preset--color--dark-card)] border border-white/[0.15] rounded-lg overflow-hidden">
						<div className="p-7 sm:p-9 border-b border-white/[0.15]">
							<div className="flex items-center gap-5">
								{ contactImage && (
									<img src={ contactImage } alt={ contactName } className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full object-cover flex-shrink-0 border-2 border-white/10" loading="lazy" />
								) }
								<div>
									<span className="text-[var(--wp--preset--color--lime)] text-[15px] font-medium font-mono">Contact Us</span>
									<span className="text-white text-[28px] sm:text-[34px] lg:text-[38px] font-bold leading-[1.1] tracking-tight block mt-1">{ contactName }</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-4 p-7 sm:p-9 font-mono">
							<div className="flex items-center gap-3">
								<span className="text-white/40 text-[13px] w-5 flex-shrink-0">✦</span>
								<span className="text-white text-[16px] leading-[1.5]">{ contactTitle }</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-white/40 text-[13px] w-5 flex-shrink-0">✦</span>
								<span className="text-white text-[16px] leading-[1.5]">{ contactCompany }</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-[var(--wp--preset--color--lime)] text-[15px] w-5 flex-shrink-0">✉</span>
								<a href={ `mailto:${ contactEmail }` } className="text-[var(--wp--preset--color--lime)] text-[16px] leading-[1.5] hover:underline">{ contactEmail }</a>
							</div>
							<div className="flex items-center gap-3">
								<span className="text-white/40 text-[15px] w-5 flex-shrink-0">✆</span>
								<a href={ `tel:${ ( contactPhone || '' ).replace( /\s/g, '' ) }` } className="text-white text-[16px] leading-[1.5] hover:text-white/70">{ contactPhone }</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
