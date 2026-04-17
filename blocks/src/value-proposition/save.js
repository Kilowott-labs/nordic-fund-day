import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		logosSubtitle, logosHeading, logos,
		subtitle, heading, bodyText, painPoints,
		imageLeft, imageRight, quoteText,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'relative bg-[var(--wp--preset--color--near-black)] pt-4 sm:pt-8 lg:pt-16',
		id: 'about',
	} );

	const hasLogos = logos && logos.some( ( l ) => l.imageUrl );

	return (
		<section { ...blockProps }>
			{ /* ── Partners / Logos strip ─────────────────────────────── */ }
			{ hasLogos && (
				<div className="px-4 sm:px-6 md:px-16 lg:px-[90px] pt-4 pb-16 md:pb-20 lg:pb-[80px] text-center">
					<RichText.Content
						tagName="span"
						value={ logosSubtitle }
						className="block font-mono text-[12px] sm:text-[14px] font-medium tracking-[0.11em] uppercase text-[var(--wp--preset--color--lime)]"
					/>
					<RichText.Content
						tagName="h2"
						value={ logosHeading }
						className="text-white text-[28px] sm:text-[36px] md:text-[44px] lg:text-[48px] font-bold uppercase leading-[1] mt-4 mb-10 md:mb-14"
					/>

					{ /* Carousel wrapper — view.js adds nav arrows when logos overflow */ }
					<div className="relative" data-logos-carousel>
						<div className="flex items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-16 overflow-x-auto px-2 pb-1" data-logos-track>
							{ logos.map( ( logo ) => logo.imageUrl && (
								<div key={ logo.id } className="flex-shrink-0" data-logo-item>
									<img
										src={ logo.imageUrl }
										alt={ logo.altText || '' }
										className="h-8 sm:h-9 md:h-10 w-auto object-contain brightness-0 invert opacity-75 hover:opacity-100 transition-opacity duration-300"
										loading="lazy"
									/>
								</div>
							) ) }
						</div>
					</div>
				</div>
			) }

			{ /* ── Value-prop split layout ─────────────────────────────── */ }
			<div className="flex flex-col lg:flex-row justify-between">
				{ /* Left Column */ }
				<div className="flex flex-col gap-12 sm:gap-16 lg:gap-[60px] xl:gap-[100px] min-[1600px]:gap-[172px] px-4 sm:px-6 md:px-16 lg:pl-[60px] xl:pl-[90px] lg:pr-8 xl:pr-12 pt-0 pb-12 sm:pb-16 lg:pb-[60px] xl:pb-[80px] min-[1600px]:pb-[132px] w-full lg:w-[42%] lg:max-w-[634px] flex-shrink-0">
					{ /* Top: Label + Heading */ }
					<div className="flex flex-col gap-3 sm:gap-5">
						<RichText.Content
							tagName="span"
							value={ subtitle }
							className="font-mono text-[11px] sm:text-[14px] lg:text-[12px] xl:text-[14px] font-medium tracking-[0.11em] uppercase text-white"
						/>
						<RichText.Content
							tagName="h2"
							value={ heading }
							className="text-[32px] sm:text-[44px] md:text-[48px] lg:text-[36px] xl:text-[48px] min-[1600px]:text-[64px] font-bold leading-[1] uppercase text-white"
						/>
					</div>
					{ /* Bottom: Body + Pain points */ }
					<div className="flex flex-col gap-4 max-w-[532px]">
						<RichText.Content
							tagName="p"
							value={ bodyText }
							className="font-mono text-white text-[13px] sm:text-[15px] lg:text-[13px] xl:text-[15px] min-[1600px]:text-lg leading-[1.6]"
						/>
						<div className="flex flex-col gap-2 sm:gap-3">
							{ painPoints.map( ( point ) => (
								<div key={ point.id } className="bg-white/10 border border-white/[0.18] rounded p-2">
									<div className="flex items-center gap-3">
										<span className="text-[var(--wp--preset--color--red-cross)] font-bold text-sm lg:text-xs xl:text-base w-[10px] flex-shrink-0">&#10007;</span>
										<span className="font-mono text-white/60 text-xs sm:text-sm lg:text-xs xl:text-sm min-[1600px]:text-base">{ point.text }</span>
									</div>
								</div>
							) ) }
						</div>
					</div>
				</div>

				{ /* Right Column — Dual images (fills remaining space, flush right) */ }
				<div className="relative w-full lg:w-[58%] h-[350px] sm:h-[450px] md:h-[500px] lg:h-[420px] xl:h-[540px] min-[1600px]:h-[779px] flex flex-row overflow-hidden self-start">
					{ /* Left image */ }
					<div className="relative w-[39%] flex-shrink-0 overflow-hidden">
						{ imageLeft && (
							<img src={ imageLeft } alt="Presenter on stage" className="w-full h-full object-cover object-center" loading="lazy" />
						) }
						<div className="absolute inset-0" style={ { background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 31%)' } }></div>
						<div className="absolute inset-0" style={ { background: 'linear-gradient(0deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.5) 99%)' } }></div>
						{ /* Two parallel diagonal lime slashes */ }
						<div className="hidden xl:block absolute inset-0 pointer-events-none overflow-hidden">
							<div className="absolute top-[-15%] left-[8%] w-[12px] min-[1600px]:w-[18px] h-[75%] bg-[var(--wp--preset--color--lime)]" style={ { transform: 'rotate(30deg)' } }></div>
							<div className="absolute top-[-15%] left-[14%] w-[12px] min-[1600px]:w-[18px] h-[75%] bg-[var(--wp--preset--color--lime)]" style={ { transform: 'rotate(30deg)' } }></div>
						</div>
					</div>

					{ /* Right image */ }
					<div className="relative flex-1 overflow-hidden">
						{ imageRight && (
							<img src={ imageRight } alt="Audience at event" className="w-full h-full object-cover object-center" loading="lazy" />
						) }
						<div className="absolute inset-0" style={ { background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 36%)' } }></div>
						<div className="absolute inset-0" style={ { background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 30%)' } }></div>

						{ /* Quote overlay */ }
						<div className="absolute top-5 right-4 sm:right-6 md:right-16 lg:right-[90px] max-w-[85%] sm:max-w-[75%] lg:max-w-[334px] z-[2]">
							<div className="flex items-start gap-2 sm:gap-3">
								<span className="text-[var(--wp--preset--color--lime)] font-bold text-sm sm:text-base flex-shrink-0">&#10038;</span>
								<p className="font-mono text-white text-[14px] sm:text-[16px] lg:text-[17px] leading-[1.5]">{ quoteText }</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
