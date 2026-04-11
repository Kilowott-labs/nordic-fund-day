import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { subtitle, heading, bodyText, painPoints, imageLeft, imageRight, quoteText } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'relative bg-[var(--wp--preset--color--near-black)]',
	} );

	return (
		<section { ...blockProps }>
			<div className="flex flex-col lg:flex-row justify-between">
				{ /* Left Column */ }
				<div className="flex flex-col gap-16 sm:gap-20 lg:gap-[172px] px-4 sm:px-6 md:px-16 lg:pl-[90px] lg:pr-0 py-16 sm:py-20 lg:py-[132px] w-full lg:w-[42%] lg:max-w-[634px] flex-shrink-0">
					{ /* Top: Label + Heading */ }
					<div className="flex flex-col gap-4 sm:gap-6">
						<RichText.Content
							tagName="span"
							value={ subtitle }
							className="font-mono text-[11px] sm:text-[14px] font-medium tracking-[0.11em] uppercase text-white"
						/>
						<RichText.Content
							tagName="h2"
							value={ heading }
							className="text-[32px] sm:text-[44px] md:text-[52px] lg:text-[56px] xl:text-[64px] font-bold leading-[1] uppercase text-white"
						/>
					</div>
					{ /* Bottom: Body + Pain points */ }
					<div className="flex flex-col gap-5 max-w-[532px]">
						<RichText.Content
							tagName="p"
							value={ bodyText }
							className="text-white text-[15px] sm:text-lg leading-[1.6]"
						/>
						<div className="flex flex-col gap-3 sm:gap-4">
							{ painPoints.map( ( point ) => (
								<div key={ point.id } className="bg-white/10 border border-white/[0.18] rounded p-2.5">
									<div className="flex items-center gap-3">
										<span className="text-[var(--wp--preset--color--red-cross)] font-bold text-base w-[10px] flex-shrink-0">&#10007;</span>
										<span className="text-white/60 text-sm sm:text-base">{ point.text }</span>
									</div>
								</div>
							) ) }
						</div>
					</div>
				</div>

				{ /* Right Column — Dual images */ }
				<div className="relative w-full lg:w-[58%] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[779px] flex flex-row overflow-hidden self-start">
					{ /* Left image */ }
					<div className="relative w-[39%] flex-shrink-0 overflow-hidden">
						{ imageLeft && (
							<img src={ imageLeft } alt="Presenter on stage" className="w-full h-full object-cover object-center" loading="lazy" />
						) }
						<div className="absolute inset-0" style={ { background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 31%)' } }></div>
						<div className="absolute inset-0" style={ { background: 'linear-gradient(0deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.5) 99%)' } }></div>
						{ /* Diagonal lime slashes */ }
						<div className="absolute top-0 left-0 w-[55%] h-[45%] pointer-events-none overflow-hidden">
							<div className="absolute top-0 left-[-10%] w-[30px] h-[160%] bg-[var(--wp--preset--color--lime)] origin-top-left" style={ { transform: 'rotate(30deg)' } }></div>
						</div>
						<div className="absolute bottom-0 right-0 w-[60%] h-[50%] pointer-events-none overflow-hidden">
							<div className="absolute bottom-0 right-[-10%] w-[30px] h-[160%] bg-[var(--wp--preset--color--lime)] origin-bottom-right" style={ { transform: 'rotate(30deg)' } }></div>
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
								<p className="text-white text-[12px] sm:text-[14px] lg:text-[16px] leading-[1.5]">{ quoteText }</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
