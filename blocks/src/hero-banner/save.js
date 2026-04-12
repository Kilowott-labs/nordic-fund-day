import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { backgroundImage, dateBadge, titleLines, primaryCta, secondaryCta, partnerLogos, cardText, cardButton1, cardButton2, stats } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'relative min-h-screen lg:min-h-0 lg:aspect-[1920/1948] overflow-hidden',
	} );

	const arrowSvg = (
		<svg width="18" height="18" viewBox="0 0 23 24" fill="none" className="sm:w-[23px] sm:h-[24px]">
			<path d="M5 19L19 5M19 5H5M19 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);

	return (
		<section { ...blockProps } data-hero-banner="">
			{ /* Background */ }
			<div className="absolute inset-0 parallax-hero">
				{ backgroundImage && (
					<img src={ backgroundImage } alt="" className="w-full h-full object-cover" loading="eager" fetchpriority="high" width="1920" height="1948" />
				) }
			</div>

			{ /* Content Container */ }
			<div className="relative z-10 flex flex-col w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-[5vw] lg:px-[90px] min-[1600px]:pl-[20%] min-[1600px]:pr-[90px] pt-[120px] sm:pt-[7vw] md:pt-[10.3vw] pb-[15vw] sm:pb-[20vw] md:pb-[15vw] lg:pb-[150px] min-[1600px]:pb-[300px]">

				{ /* Title Area */ }
				<div className="flex flex-col items-start gap-3 md:gap-4">
					<div data-hero-badge="" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/20 border border-white/50">
						<span className="text-white text-[11px] sm:text-[14px] font-bold tracking-[0.29em] uppercase date-glow">
							{ dateBadge }
						</span>
					</div>

					<div className="flex flex-col gap-0 sm:gap-1 hero-glow overflow-hidden">
						{ titleLines.map( ( line ) => (
							<h1
								key={ line.id }
								data-hero-title=""
								className="text-[50px] sm:text-[56px] md:text-[72px] lg:text-[80px] xl:text-[90px] min-[1400px]:text-[110px] min-[1600px]:text-[140px] font-black leading-[0.85] uppercase text-white"
							>
								{ line.text }
							</h1>
						) ) }
					</div>

					{ /* CTA Buttons */ }
					<div data-hero-cta="" className="flex items-stretch gap-2 sm:gap-4 mt-2 sm:mt-4">
						<a href={ primaryCta.url || '#' } className="group flex flex-col gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-6 w-[140px] sm:w-[195px] bg-[var(--wp--preset--color--lime)] hover:bg-white shadow-[0_4px_24px_rgba(212,255,73,0.3)] hover:shadow-[0_4px_32px_rgba(255,255,255,0.3)] transition-all duration-300">
							<div className="flex items-center justify-between w-full">
								<span className="text-[var(--wp--preset--color--dark-olive)] text-[10px] sm:text-[12px] font-bold tracking-[0.12em] uppercase leading-[1.75]">{ primaryCta.label }</span>
								<span className="text-[var(--wp--preset--color--dark-olive)]">{ arrowSvg }</span>
							</div>
							<span className="text-[var(--wp--preset--color--dark-olive)] text-[16px] sm:text-[24px] font-semibold leading-none tracking-[-0.07em]">{ primaryCta.sublabel }</span>
						</a>
						<a href={ secondaryCta.url || '#' } className="group flex flex-col gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-6 w-[140px] sm:w-[195px] border border-white/50 bg-white/30 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:bg-[var(--wp--preset--color--lime)] hover:border-[var(--wp--preset--color--lime)] transition-all duration-300 no-underline">
							<div className="flex items-center justify-between w-full">
								<span className="text-black group-hover:text-[var(--wp--preset--color--dark-olive)] transition-colors duration-300 text-[10px] sm:text-[12px] font-bold tracking-[0.12em] uppercase leading-[1.75]">{ secondaryCta.label }</span>
								<span className="text-black group-hover:text-[var(--wp--preset--color--dark-olive)] transition-colors duration-300">{ arrowSvg }</span>
							</div>
							<span className="text-black group-hover:text-[var(--wp--preset--color--dark-olive)] transition-colors duration-300 text-[16px] sm:text-[24px] font-semibold leading-none tracking-[-0.07em]">{ secondaryCta.sublabel }</span>
						</a>
					</div>
				</div>

				{ /* Spacer */ }
				<div className="h-[2rem] sm:h-[80px] md:h-[60px] lg:h-[80px] xl:h-[120px] min-[1600px]:h-[360px]"></div>

				{ /* Bottom Section */ }
				<div data-hero-bottom="" className="relative z-10 flex flex-col items-end gap-3 lg:gap-6 w-full lg:self-end lg:max-w-[55%] min-[1600px]:max-w-[704px]">
					{ /* Partner Logos */ }
					<div className="flex items-center flex-wrap justify-end gap-4 sm:gap-5 lg:gap-[21px]">
						{ partnerLogos.map( ( logo ) => (
							logo.url ? (
								<img key={ logo.id } src={ logo.url } alt={ logo.alt } className="h-[28px] sm:h-[40px] lg:h-[56px] w-auto max-w-[100px] sm:max-w-[120px] lg:max-w-[150px] object-contain" loading="lazy" />
							) : null
						) ) }
					</div>

					{ /* CTA Card */ }
					<div className="w-full bg-black/10 backdrop-blur-md border border-white/30 rounded-[10px] p-4 sm:p-[30px_40px] shadow-[0px_5px_33px_rgba(0,0,0,0.05)]">
						<div className="flex flex-col items-end gap-4 sm:gap-8">
							<RichText.Content
								tagName="p"
								value={ cardText }
								className="text-white text-[16px] sm:text-[18px] lg:text-[20px] font-medium leading-[1.2] text-right"
							/>
							<div className="flex flex-row items-center gap-2 sm:gap-3">
								<a href={ cardButton1.url || '#' } className="inline-flex items-center justify-center px-3 sm:px-6 py-2.5 sm:py-4 h-[40px] sm:h-[48px] bg-black rounded-full text-white text-[11px] sm:text-[14px] lg:text-[16px] font-semibold uppercase tracking-[0.03em] hover:bg-[var(--wp--preset--color--lime)] hover:text-black transition-all duration-300 whitespace-nowrap">
									{ cardButton1.label }
								</a>
								<a href={ cardButton2.url || '#' } className="inline-flex items-center justify-center px-3 sm:px-6 py-2.5 sm:py-4 h-[40px] sm:h-[48px] bg-white rounded-full text-black text-[11px] sm:text-[14px] lg:text-[16px] font-semibold uppercase tracking-[0.03em] hover:bg-[var(--wp--preset--color--lime)] hover:text-black transition-all duration-300 whitespace-nowrap">
									{ cardButton2.label }
								</a>
							</div>
						</div>
					</div>

					{ /* Stats */ }
					<div className="flex items-center gap-6 sm:gap-10 lg:gap-[57px]">
						{ stats.map( ( stat ) => (
							<div key={ stat.id } className="flex flex-col gap-[2px]">
								<span className="font-mono font-medium text-[24px] sm:text-[32px] lg:text-[40px] leading-[1.2] text-white">{ stat.value }</span>
								<span className="text-white/90 text-[11px] sm:text-[14px] font-semibold uppercase tracking-[0.04em]">{ stat.label }</span>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</section>
	);
}
