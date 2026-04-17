import { useBlockProps, RichText } from '@wordpress/block-editor';

const PhoneIcon = () => (
	<svg className="w-[18px] h-[18px] flex-shrink-0 text-[var(--wp--preset--color--lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
	</svg>
);

const EmailIcon = () => (
	<svg className="w-[18px] h-[18px] flex-shrink-0 text-[var(--wp--preset--color--lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
	</svg>
);

const LocationIcon = () => (
	<svg className="w-[18px] h-[18px] flex-shrink-0 text-[var(--wp--preset--color--lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
	</svg>
);

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
				<div className="flex-1 min-w-0">
					<div className="bg-[var(--wp--preset--color--dark-card)] border border-white/[0.15] rounded-lg overflow-hidden h-full">
						{ /* Card Header: Photo + Name + Title */ }
						<div className="p-7 sm:p-9 border-b border-white/[0.15]">
							<div className="flex items-center gap-5">
								{ contactImage && (
									<img
										src={ contactImage }
										alt={ contactName }
										className="w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] rounded-full object-cover flex-shrink-0"
										loading="lazy"
									/>
								) }
								<div className="flex flex-col gap-1.5 min-w-0">
									<span className="text-white text-[22px] sm:text-[26px] lg:text-[30px] font-bold leading-[1.1] tracking-tight">
										{ contactName }
									</span>
									<span className="text-[var(--wp--preset--color--lime)] text-[13px] sm:text-[14px] font-medium font-mono">
										{ contactTitle }
									</span>
								</div>
							</div>
						</div>

						{ /* Contact Details: phone → email → company */ }
						<div className="flex flex-col gap-4 p-7 sm:p-9 font-mono">
							<div className="flex items-center gap-3">
								<PhoneIcon />
								<a
									href={ `tel:${ ( contactPhone || '' ).replace( /\s/g, '' ) }` }
									className="text-white text-[15px] leading-[1.5] hover:text-white/70 transition-colors duration-200"
								>
									{ contactPhone }
								</a>
							</div>
							<div className="flex items-center gap-3">
								<EmailIcon />
								<a
									href={ `mailto:${ contactEmail }` }
									className="text-white text-[15px] leading-[1.5] hover:text-white/70 transition-colors duration-200"
								>
									{ contactEmail }
								</a>
							</div>
							<div className="flex items-center gap-3">
								<LocationIcon />
								<span className="text-white text-[15px] leading-[1.5]">
									{ contactCompany }
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
