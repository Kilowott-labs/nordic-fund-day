import { useBlockProps, RichText } from '@wordpress/block-editor';

function Badge( { text, type } ) {
	if ( ! text ) return null;
	const isLime = type === 'lime';
	const borderClass = isLime
		? 'border-[var(--wp--preset--color--lime)]'
		: 'border-white/20';
	const bgStyle = isLime ? { backgroundColor: 'rgba(212, 255, 73, 0.12)' } : {};
	const textClass = isLime
		? 'text-[var(--wp--preset--color--lime)]'
		: 'text-white';

	return (
		<div className={ `inline-flex items-center px-3 py-1 border ${ borderClass } rounded-sm` } style={ bgStyle }>
			<span className={ `font-mono text-[11px] font-medium tracking-[0.08em] uppercase ${ textClass }` }>
				{ text }
			</span>
		</div>
	);
}

export default function save( { attributes } ) {
	const { subtitle, heading, ctaLabel, ctaUrl, ctaOpenInNewTab, days } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'bg-white px-4 sm:px-6 md:px-[90px] py-12 sm:py-16 md:py-24 lg:py-[100px]',
	} );

	return (
		<section { ...blockProps }>
			<div className="flex flex-col gap-12">
				{ /* Header */ }
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div className="flex flex-col gap-4">
						<RichText.Content
							tagName="span"
							value={ subtitle }
							className="font-mono text-[14px] font-medium tracking-[0.1em] uppercase text-black"
						/>
						<RichText.Content
							tagName="h2"
							value={ heading }
							className="text-black text-[40px] sm:text-[48px] md:text-[56px] lg:text-[56px] xl:text-[64px] font-bold leading-[1.05] uppercase"
						/>
					</div>
					<a
						href={ ctaUrl || '#' }
						className="inline-flex items-center px-8 py-3.5 bg-[var(--wp--preset--color--lime-cta)] border border-transparent rounded-full text-black font-semibold text-[15px] uppercase tracking-[0.03em] hover:bg-white hover:text-black hover:border-black/20 transition-all duration-300 w-fit"
						{ ...( ctaOpenInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {} ) }
					>
						{ ctaLabel }
					</a>
				</div>

				{ /* Day Cards Grid */ }
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{ days.map( ( day ) => (
						<div key={ day.id } className="bg-[var(--wp--preset--color--dark-pill)] rounded-lg overflow-hidden">
							<div className="p-7 pb-6">
								<span className="font-mono text-[var(--wp--preset--color--lime)] text-[13px] font-medium tracking-[0.05em]">
									{ day.dateLabel }
								</span>
								<h3 className="text-white text-[28px] sm:text-[32px] font-bold leading-tight mt-2">
									{ day.title }
								</h3>
								<div className="w-full h-px bg-white/15 mt-6"></div>
							</div>
							<div className="flex flex-col px-7 pb-7">
								{ day.events.map( ( event, eIdx ) => (
									<div key={ eIdx } className="flex gap-6 py-5">
										<span className="font-mono text-white/50 text-[14px] w-[70px] flex-shrink-0 pt-[2px]">
											{ event.time }
										</span>
										<div>
											<h4 className="text-white text-[16px] font-bold mb-1">
												{ event.title }
											</h4>
											{ event.description && (
												<p className={ `text-white/60 text-[14px] leading-[1.5]${ event.badge ? ' mb-3' : '' }` }>
													{ event.description }
												</p>
											) }
											<Badge text={ event.badge } type={ event.badgeType } />
										</div>
									</div>
								) ) }
							</div>
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
