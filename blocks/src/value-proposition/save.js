import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { subtitle, heading, bodyText, painPoints, imageLeft, imageRight, quoteText } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'relative bg-[var(--wp--preset--color--near-black)] pt-8 sm:pt-12 lg:pt-16',
	} );

	return (
		<section { ...blockProps }>
			<div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-6 xl:gap-0">
				{ /* Left Column */ }
				<div className="flex flex-col gap-12 sm:gap-16 lg:gap-[60px] xl:gap-[100px] min-[1600px]:gap-[172px] px-4 sm:px-6 md:px-16 lg:pl-[60px] xl:pl-[90px] lg:pr-0 py-12 sm:py-16 lg:py-[60px] xl:py-[80px] min-[1600px]:py-[132px] w-full lg:w-[42%] lg:max-w-[634px] flex-shrink-0">
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
								<div key={ point.id } className="bg-white/10 border border-white/[0.18] rounded p-2 lg:p-2">
									<div className="flex items-center gap-3">
										<span className="text-[var(--wp--preset--color--red-cross)] font-bold text-sm lg:text-xs xl:text-base w-[10px] flex-shrink-0">&#10007;</span>
										<span className="font-mono text-white/60 text-xs sm:text-sm lg:text-xs xl:text-sm min-[1600px]:text-base">{ point.text }</span>
									</div>
								</div>
							) ) }
						</div>
					</div>
				</div>

				{ /* Right Column — Dual images */ }
				<div className="relative w-full lg:w-[58%] h-[350px] sm:h-[450px] md:h-[500px] lg:h-[500px] xl:h-[600px] min-[1600px]:h-[779px] flex flex-row overflow-hidden self-start">
					{ /* Left image */ }
					<div className="relative w-[39%] flex-shrink-0 overflow-hidden">
						{ imageLeft && (
							<img src={ imageLeft } alt="Presenter on stage" className="w-full h-full object-cover object-center" loading="lazy" />
						) }
						<div className="absolute inset-0" style={ { background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 31%)' } }></div>
						<div className="absolute inset-0" style={ { background: 'linear-gradient(0deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.5) 99%)' } }></div>
						{ /* Diagonal lime slashes — hidden on mobile, smaller on tablet */ }
						<div className="hidden md:block absolute top-0 left-0 w-[55%] h-[45%] pointer-events-none overflow-hidden">
							<div className="absolute top-0 left-[-10%] w-[15px] lg:w-[20px] min-[1600px]:w-[30px] h-[160%] bg-[var(--wp--preset--color--lime)] origin-top-left" style={ { transform: 'rotate(30deg)' } }></div>
						</div>
						<div className="hidden md:block absolute bottom-0 right-0 w-[60%] h-[50%] pointer-events-none overflow-hidden">
							<div className="absolute bottom-0 right-[-10%] w-[15px] lg:w-[20px] min-[1600px]:w-[30px] h-[160%] bg-[var(--wp--preset--color--lime)] origin-bottom-right" style={ { transform: 'rotate(30deg)' } }></div>
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
						<div className="absolute top-5 sm:top-7 right-4 sm:right-6 max-w-[85%] sm:max-w-[75%] lg:max-w-[334px] z-[2]">
							<div className="flex items-start gap-2 sm:gap-3">
								<span className="text-[var(--wp--preset--color--lime)] font-bold text-sm sm:text-base flex-shrink-0">&#10038;</span>
								<p className="font-mono text-white text-[12px] sm:text-[14px] lg:text-[16px] leading-[1.5]">{ quoteText }</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
