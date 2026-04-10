import { useBlockProps } from '@wordpress/block-editor';

function MarqueeStrip( { strip } ) {
	const itemStyle = {
		color: strip.textColor,
		fontSize: `${ strip.fontSize }px`,
		fontWeight: 500,
		letterSpacing: '-0.02em',
		lineHeight: 1,
		marginRight: `${ strip.gap }px`,
		fontFamily: 'var(--wp--preset--font-family--dm-sans)',
	};

	// Items duplicated once for seamless loop — animation moves -50% then resets
	const items = [ ...strip.items, ...strip.items ];

	return (
		<div
			className="w-full overflow-hidden py-[30px]"
			style={ {
				backgroundColor: strip.bgColor,
				'--marquee-separator-color': strip.separatorColor,
			} }
		>
			<div className="overflow-hidden w-full">
				<div
					className={ `marquee-track marquee-track--${ strip.direction }` }
				>
					{ items.map( ( item, idx ) => (
						<span
							key={ idx }
							className={ `marquee-item${ strip.showSeparator ? ' marquee-item--dot' : '' }` }
							style={ itemStyle }
						>
							{ item.text }
						</span>
					) ) }
				</div>
			</div>
		</div>
	);
}

export default function save( { attributes } ) {
	const {
		layout,
		tilt,
		tiltAngle,
		sectionHeight,
		sectionHeightMobile,
		sectionBg,
		speed,
		pauseOnHover,
		strips,
	} = attributes;

	const visibleStrips = layout === 'single' ? strips.slice( 0, 1 ) : strips.slice( 0, 2 );

	const blockProps = useBlockProps.save( {
		className: tilt
			? 'relative w-full overflow-hidden is-tilt'
			: 'w-full overflow-hidden',
		style: {
			'--marquee-speed': `${ speed }s`,
			'--tilt-angle': `${ tiltAngle }deg`,
			...( tilt ? {
				'--marquee-height-desktop': `${ sectionHeight }px`,
				'--marquee-height-mobile': `${ sectionHeightMobile }px`,
			} : {} ),
			...( sectionBg ? { backgroundColor: sectionBg } : {} ),
		},
		'data-pause-on-hover': String( pauseOnHover ),
	} );

	return (
		<section { ...blockProps }>
			{ visibleStrips.map( ( strip, index ) => {
				if ( tilt ) {
					const tiltSign  = index === 0 ? -1 : 1;
					const topOffset = index === 0 ? '40%' : '48%';
					return (
						<div
							key={ strip.id }
							className={ `marquee-strip marquee-strip--${ index + 1 }` }
							style={ {
								top: topOffset,
								transform: `rotate(${ tiltSign * tiltAngle }deg)`,
							} }
						>
							<MarqueeStrip strip={ strip } />
						</div>
					);
				}
				return <MarqueeStrip key={ strip.id } strip={ strip } />;
			} ) }
		</section>
	);
}
