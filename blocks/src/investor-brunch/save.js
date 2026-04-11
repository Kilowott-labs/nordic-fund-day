import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { subtitle, heading, dateInfo, description, image, imageAlt, labelLine1, labelLine2, badges, ctaLabel, ctaUrl, ctaOpenInNewTab } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'bg-white relative z-[2]',
	} );

	return (
		<section { ...blockProps }>
			<div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-[106px] px-4 sm:px-6 md:px-16 lg:px-[90px] py-16 lg:py-[132px]">
				{ /* Left: Content */ }
				<div className="flex flex-col gap-12 w-full lg:max-w-[634px]">
					<div className="flex flex-col gap-4">
						<RichText.Content
							tagName="span"
							value={ subtitle }
							className="font-mono text-[14px] font-medium tracking-[0.1em] uppercase text-black"
						/>
						<RichText.Content
							tagName="h2"
							value={ heading }
							className="text-[40px] sm:text-[52px] md:text-[56px] lg:text-[56px] xl:text-[64px] min-[1600px]:text-[72px] font-bold leading-[0.95] uppercase text-black"
						/>
						<span className="text-black text-[18px] sm:text-[20px] font-bold">{ dateInfo }</span>
						<RichText.Content
							tagName="div"
							value={ description }
							className="font-mono text-[15px] sm:text-[16px] leading-[1.4] text-black/70 space-y-4 mt-2"
						/>
					</div>

					<div className="flex flex-col gap-[14px]">
						{ badges.map( ( badge ) => (
							<div key={ badge.id } className="flex items-center gap-3 p-2 sm:p-3 bg-black border border-white/[0.08] rounded">
								<div
									className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-[var(--wp--preset--color--lime)]"
									dangerouslySetInnerHTML={ { __html: badge.iconSvg } }
								/>
								<span className="text-white text-[16px] font-bold leading-[1.5]">{ badge.text }</span>
							</div>
						) ) }
					</div>

					<a
						href={ ctaUrl || '#' }
						className="inline-flex items-center px-8 py-4 bg-[var(--wp--preset--color--lime-cta)] border border-transparent rounded-full text-black font-semibold text-base w-fit hover:bg-white hover:text-black hover:border-black/20 transition-all duration-300"
						{ ...( ctaOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {} ) }
					>
						{ ctaLabel }
					</a>
				</div>

				{ /* Right: Image area (lime bg behind, image offset left) */ }
				<div className="relative w-full lg:w-[52%] flex-shrink-0">
					<div className="h-[40px] sm:h-[60px] lg:h-[80px]"></div>
					<div className="absolute top-0 right-0 bg-[var(--wp--preset--color--lime)] rounded-sm w-[calc(100%-30px)] sm:w-[calc(100%-50px)] lg:w-[calc(100%-75px)] h-full"></div>
					<div className="relative z-[1] mr-[30px] sm:mr-[50px] lg:mr-[75px]" style={ { aspectRatio: '921/683' } }>
						{ image && (
							<img src={ image } alt={ imageAlt } className="w-full h-full object-cover" loading="lazy" />
						) }
					</div>
					<div className="relative z-[1] flex flex-col items-end gap-[2px] pr-8 py-5">
						<span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-black">{ labelLine1 }</span>
						<span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-black">{ labelLine2 }</span>
					</div>
				</div>
			</div>
		</section>
	);
}
