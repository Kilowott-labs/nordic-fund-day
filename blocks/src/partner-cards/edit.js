import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	Button,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, heading, description, ctaLabel, ctaUrl, ctaOpenInNewTab, cards } = attributes;

	const blockProps = useBlockProps( {
		className: 'bg-black px-4 sm:px-6 md:px-16 lg:px-[90px] py-16 md:py-24 lg:py-[120px]',
	} );

	const updateCard = ( index, fields ) => {
		const updated = [ ...cards ];
		updated[ index ] = { ...updated[ index ], ...fields };
		setAttributes( { cards: updated } );
	};

	const updateFeature = ( cardIndex, featureIndex, text ) => {
		const updated = [ ...cards ];
		const features = [ ...updated[ cardIndex ].features ];
		features[ featureIndex ] = { text };
		updated[ cardIndex ] = { ...updated[ cardIndex ], features };
		setAttributes( { cards: updated } );
	};

	const addFeature = ( cardIndex ) => {
		const updated = [ ...cards ];
		const features = [ ...updated[ cardIndex ].features, { text: __( 'New feature', 'nordic-fund-day' ) } ];
		updated[ cardIndex ] = { ...updated[ cardIndex ], features };
		setAttributes( { cards: updated } );
	};

	const removeFeature = ( cardIndex, featureIndex ) => {
		const updated = [ ...cards ];
		const features = updated[ cardIndex ].features.filter( ( _, i ) => i !== featureIndex );
		updated[ cardIndex ] = { ...updated[ cardIndex ], features };
		setAttributes( { cards: updated } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'CTA Button', 'nordic-fund-day' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Button Label', 'nordic-fund-day' ) }
						value={ ctaLabel }
						onChange={ ( value ) => setAttributes( { ctaLabel: value } ) }
					/>
					<TextControl
						label={ __( 'Button URL', 'nordic-fund-day' ) }
						value={ ctaUrl }
						onChange={ ( value ) => setAttributes( { ctaUrl: value } ) }
						type="url"
					/>
					<ToggleControl
						label={ __( 'Open in new tab', 'nordic-fund-day' ) }
						checked={ ctaOpenInNewTab }
						onChange={ ( value ) => setAttributes( { ctaOpenInNewTab: value } ) }
					/>
				</PanelBody>

				{ cards.map( ( card, cIdx ) => (
					<PanelBody
						key={ card.id }
						title={ card.label || `${ __( 'Card', 'nordic-fund-day' ) } ${ cIdx + 1 }` }
						initialOpen={ false }
					>
						<TextControl
							label={ __( 'Label', 'nordic-fund-day' ) }
							value={ card.label }
							onChange={ ( value ) => updateCard( cIdx, { label: value } ) }
						/>
						<TextControl
							label={ __( 'Price', 'nordic-fund-day' ) }
							value={ card.price }
							onChange={ ( value ) => updateCard( cIdx, { price: value } ) }
						/>
						<ToggleControl
							label={ __( 'Premium tier', 'nordic-fund-day' ) }
							checked={ card.isPremium }
							onChange={ ( value ) => updateCard( cIdx, { isPremium: value } ) }
						/>
						{ card.isPremium && (
							<TextControl
								label={ __( 'Badge text', 'nordic-fund-day' ) }
								value={ card.badgeText }
								onChange={ ( value ) => updateCard( cIdx, { badgeText: value } ) }
							/>
						) }

						<p style={ { fontWeight: 600, marginTop: '16px', marginBottom: '8px' } }>
							{ __( 'Features', 'nordic-fund-day' ) }
						</p>
						{ card.features.map( ( feature, fIdx ) => (
							<div key={ fIdx } style={ { display: 'flex', gap: '4px', marginBottom: '6px' } }>
								<TextControl
									value={ feature.text }
									onChange={ ( value ) => updateFeature( cIdx, fIdx, value ) }
									style={ { flex: 1 } }
								/>
								{ card.features.length > 1 && (
									<Button
										onClick={ () => removeFeature( cIdx, fIdx ) }
										icon="no-alt"
										isDestructive
										label={ __( 'Remove', 'nordic-fund-day' ) }
									/>
								) }
							</div>
						) ) }
						<Button
							onClick={ () => addFeature( cIdx ) }
							variant="secondary"
							style={ { width: '100%' } }
						>
							{ __( '+ Add Feature', 'nordic-fund-day' ) }
						</Button>
					</PanelBody>
				) ) }
			</InspectorControls>

			<section { ...blockProps }>
				<div className="flex flex-col lg:flex-row gap-12 lg:gap-12 xl:gap-16 items-start">
					{ /* Left Column */ }
					<div className="flex flex-col gap-10 lg:w-[34%] lg:flex-shrink-0">
						<div className="flex flex-col gap-5">
							<RichText
								tagName="span"
								value={ subtitle }
								onChange={ ( value ) => setAttributes( { subtitle: value } ) }
								className="font-mono text-[14px] font-medium tracking-[0.1em] uppercase text-[var(--wp--preset--color--lime)]"
								placeholder={ __( 'Subtitle…', 'nordic-fund-day' ) }
							/>
							<RichText
								tagName="h2"
								value={ heading }
								onChange={ ( value ) => setAttributes( { heading: value } ) }
								className="text-white text-[36px] sm:text-[44px] md:text-[56px] lg:text-[56px] xl:text-[56px] font-bold leading-[1.05] uppercase"
								placeholder={ __( 'Heading…', 'nordic-fund-day' ) }
							/>
						</div>
						<RichText
							tagName="p"
							value={ description }
							onChange={ ( value ) => setAttributes( { description: value } ) }
							className="font-mono text-[15px] sm:text-[16px] leading-[1.6] text-white max-w-[380px]"
							placeholder={ __( 'Description…', 'nordic-fund-day' ) }
						/>
						<div className="inline-flex items-center px-6 sm:px-10 py-3.5 sm:py-4 bg-[var(--wp--preset--color--lime-cta)] rounded-full text-black font-semibold text-[13px] sm:text-[16px] uppercase tracking-[0.02em] w-fit whitespace-nowrap">
							{ ctaLabel }
						</div>
					</div>

					{ /* Right Column — Partner Cards */ }
					<div className="flex flex-col sm:flex-row gap-5 flex-1">
						{ cards.map( ( card ) => {
							const isLime = card.labelColor === 'lime' || card.isPremium;
							const textColorClass = isLime ? 'text-[var(--wp--preset--color--lime)]' : 'text-white';

							return (
								<div key={ card.id } className="flex-1 bg-[var(--wp--preset--color--dark-card)] border border-white/[0.15] rounded-lg overflow-hidden">
									<div className="p-7 sm:p-8 border-b border-white/[0.15]">
										{ card.isPremium ? (
											<div className="flex items-start justify-between gap-4">
												<div className="flex flex-col gap-1">
													<span className={ `${ textColorClass } text-[15px] font-medium font-mono` }>
														{ card.label }
													</span>
													<span className={ `${ textColorClass } text-[32px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.1] tracking-tight` }>
														{ card.price }
													</span>
												</div>
												{ card.badgeText && (
													<div className="inline-flex items-center px-5 py-2 bg-[var(--wp--preset--color--lime)]/[0.08] border border-[var(--wp--preset--color--lime)] rounded-full mt-2">
														<span className="text-[var(--wp--preset--color--lime)] text-[13px] font-semibold uppercase tracking-[0.1em]">
															{ card.badgeText }
														</span>
													</div>
												) }
											</div>
										) : (
											<>
												<span className={ `${ textColorClass } text-[15px] font-medium font-mono` }>
													{ card.label }
												</span>
												<span className={ `${ textColorClass } text-[32px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.1] tracking-tight block mt-1` }>
													{ card.price }
												</span>
											</>
										) }
									</div>
									<div className="flex flex-col gap-3 p-7 sm:p-8 font-mono">
										{ card.features.map( ( feature, fIdx ) => (
											<div key={ fIdx } className="flex items-start gap-3">
												<span className="text-white/50 text-[16px] mt-[1px]">→</span>
												<span className="text-white text-[16px] leading-[1.5]">{ feature.text }</span>
											</div>
										) ) }
									</div>
								</div>
							);
						} ) }
					</div>
				</div>
			</section>
		</>
	);
}
