import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { backgroundImage, subtitle, heading, dateInfo, descriptionText, ctaLabel, ctaUrl, ctaOpenInNewTab, sectors } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'relative min-h-[600px] md:min-h-[1200px] overflow-hidden flex items-end',
		id: 'agenda',
	} );

	return (
		<section { ...blockProps }>
			{ /* Background Image */ }
			<div className="absolute inset-0">
				{ backgroundImage && (
					<img src={ backgroundImage } alt="" className="w-full h-full object-cover object-top" loading="lazy" />
				) }
			</div>

			{ /* Content */ }
			<div className="relative z-10 flex flex-col justify-end h-full px-4 sm:px-6 md:px-[90px] py-8">
				<div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-12 mb-8">
					<div className="flex flex-col gap-4 ">
						<RichText.Content
							tagName="span"
							value={ subtitle }
							className="font-mono text-[14px] font-medium tracking-[0.1em] uppercase text-white"
						/>
						<RichText.Content
							tagName="h2"
							value={ heading }
							className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[56px] xl:text-[64px] font-bold leading-[1] uppercase text-white"
						/>
						<span className="text-white text-[20px] sm:text-[24px] font-bold">{ dateInfo }</span>
					</div>
					<div className="bg-black/20 backdrop-blur-md rounded-lg p-5 sm:p-7 max-w-[520px] w-full lg:w-[520px] border border-white/10" style={ { outline: '1px solid #bfbfbf' } }>
						<RichText.Content
							tagName="p"
							value={ descriptionText }
							className="font-mono text-[14px] sm:text-[16px] leading-[1.4] text-white mb-5"
						/>
						<a
							href={ ctaUrl || '#' }
							className="inline-flex items-center justify-center px-6 py-3 bg-white rounded-full text-black text-[14px] sm:text-[16px] font-semibold uppercase tracking-[0.03em] hover:bg-[var(--wp--preset--color--lime)] hover:text-black transition-all duration-300"
							{ ...( ctaOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {} ) }
						>
							{ ctaLabel }
						</a>
					</div>
				</div>

				{ /* Sector Cards */ }
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pb-2">
					{ sectors.map( ( sector ) => (
						<div key={ sector.id } className="bg-[var(--wp--preset--color--dark-card)] rounded-[5px] p-6 sm:p-7 flex flex-col gap-4">
							<div className="w-10 h-10 flex items-center justify-center text-[var(--wp--preset--color--lime)]">
								{ sector.iconUrl ? (
									<img src={ sector.iconUrl } alt="" className="w-8 h-8 object-contain" loading="lazy" />
								) : (
									<span dangerouslySetInnerHTML={ { __html: sector.iconSvg } } />
								) }
							</div>
							<h3 className="text-[var(--wp--preset--color--lime)] text-[20px] font-bold leading-[1.2]">
								{ sector.title }
							</h3>
							<p className="font-mono text-[14px] leading-[1.4] text-[var(--wp--preset--color--grey-muted)]">
								{ sector.description }
							</p>
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
