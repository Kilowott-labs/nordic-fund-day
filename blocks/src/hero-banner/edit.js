import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	Button,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { backgroundImage, backgroundImageId, dateBadge, titleLines, primaryCta, secondaryCta, partnerLogos, cardText, cardButton1, cardButton2, stats } = attributes;

	const blockProps = useBlockProps( {
		className: 'relative min-h-screen lg:min-h-0 lg:aspect-[1920/1948]',
	} );

	const updateTitleLine = ( index, text ) => {
		const updated = [ ...titleLines ];
		updated[ index ] = { ...updated[ index ], text };
		setAttributes( { titleLines: updated } );
	};

	const updateStat = ( index, fields ) => {
		const updated = [ ...stats ];
		updated[ index ] = { ...updated[ index ], ...fields };
		setAttributes( { stats: updated } );
	};

	const updatePartnerLogo = ( index, fields ) => {
		const updated = [ ...partnerLogos ];
		updated[ index ] = { ...updated[ index ], ...fields };
		setAttributes( { partnerLogos: updated } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Background Image', 'nordic-fund-day' ) } initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { backgroundImage: media.url, backgroundImageId: media.id } ) }
							allowedTypes={ [ 'image' ] }
							value={ backgroundImageId }
							render={ ( { open } ) => (
								<>
									{ backgroundImage && <img src={ backgroundImage } alt="" style={ { width: '100%', height: 'auto', marginBottom: '8px', borderRadius: '4px' } } /> }
									<Button onClick={ open } variant="secondary" style={ { width: '100%' } }>
										{ backgroundImage ? __( 'Change', 'nordic-fund-day' ) : __( 'Upload', 'nordic-fund-day' ) }
									</Button>
								</>
							) }
						/>
					</MediaUploadCheck>
					{ backgroundImage && (
						<Button onClick={ () => setAttributes( { backgroundImage: '', backgroundImageId: 0 } ) } variant="link" isDestructive style={ { marginTop: '4px' } }>
							{ __( 'Remove', 'nordic-fund-day' ) }
						</Button>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Title & Date', 'nordic-fund-day' ) } initialOpen={ false }>
					<TextControl label={ __( 'Date Badge', 'nordic-fund-day' ) } value={ dateBadge } onChange={ ( v ) => setAttributes( { dateBadge: v } ) } />
					{ titleLines.map( ( line, idx ) => (
						<TextControl key={ line.id } label={ `${ __( 'Title Line', 'nordic-fund-day' ) } ${ idx + 1 }` } value={ line.text } onChange={ ( v ) => updateTitleLine( idx, v ) } />
					) ) }
				</PanelBody>

				<PanelBody title={ __( 'Hero CTAs', 'nordic-fund-day' ) } initialOpen={ false }>
					<p style={ { fontWeight: 600, marginBottom: '8px' } }>{ __( 'Primary CTA (Green)', 'nordic-fund-day' ) }</p>
					<TextControl label={ __( 'Label', 'nordic-fund-day' ) } value={ primaryCta.label } onChange={ ( v ) => setAttributes( { primaryCta: { ...primaryCta, label: v } } ) } />
					<TextControl label={ __( 'Sublabel', 'nordic-fund-day' ) } value={ primaryCta.sublabel } onChange={ ( v ) => setAttributes( { primaryCta: { ...primaryCta, sublabel: v } } ) } />
					<TextControl label={ __( 'URL', 'nordic-fund-day' ) } value={ primaryCta.url } onChange={ ( v ) => setAttributes( { primaryCta: { ...primaryCta, url: v } } ) } type="url" />

					<p style={ { fontWeight: 600, marginTop: '16px', marginBottom: '8px' } }>{ __( 'Secondary CTA (Glass)', 'nordic-fund-day' ) }</p>
					<TextControl label={ __( 'Label', 'nordic-fund-day' ) } value={ secondaryCta.label } onChange={ ( v ) => setAttributes( { secondaryCta: { ...secondaryCta, label: v } } ) } />
					<TextControl label={ __( 'Sublabel', 'nordic-fund-day' ) } value={ secondaryCta.sublabel } onChange={ ( v ) => setAttributes( { secondaryCta: { ...secondaryCta, sublabel: v } } ) } />
					<TextControl label={ __( 'URL', 'nordic-fund-day' ) } value={ secondaryCta.url } onChange={ ( v ) => setAttributes( { secondaryCta: { ...secondaryCta, url: v } } ) } type="url" />
				</PanelBody>

				<PanelBody title={ __( 'Partner Logos', 'nordic-fund-day' ) } initialOpen={ false }>
					{ partnerLogos.map( ( logo, idx ) => (
						<div key={ logo.id } style={ { marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #ddd' } }>
							<TextControl label={ `${ __( 'Alt Text', 'nordic-fund-day' ) } ${ idx + 1 }` } value={ logo.alt } onChange={ ( v ) => updatePartnerLogo( idx, { alt: v } ) } />
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => updatePartnerLogo( idx, { url: media.url, imageId: media.id } ) }
									allowedTypes={ [ 'image' ] }
									value={ logo.imageId }
									render={ ( { open } ) => (
										<Button onClick={ open } variant="secondary" style={ { width: '100%' } }>
											{ logo.url ? __( 'Change Logo', 'nordic-fund-day' ) : __( 'Upload Logo', 'nordic-fund-day' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
						</div>
					) ) }
				</PanelBody>

				<PanelBody title={ __( 'Bottom Card', 'nordic-fund-day' ) } initialOpen={ false }>
					<TextControl label={ __( 'Button 1 Label', 'nordic-fund-day' ) } value={ cardButton1.label } onChange={ ( v ) => setAttributes( { cardButton1: { ...cardButton1, label: v } } ) } />
					<TextControl label={ __( 'Button 1 URL', 'nordic-fund-day' ) } value={ cardButton1.url } onChange={ ( v ) => setAttributes( { cardButton1: { ...cardButton1, url: v } } ) } type="url" />
					<TextControl label={ __( 'Button 2 Label', 'nordic-fund-day' ) } value={ cardButton2.label } onChange={ ( v ) => setAttributes( { cardButton2: { ...cardButton2, label: v } } ) } />
					<TextControl label={ __( 'Button 2 URL', 'nordic-fund-day' ) } value={ cardButton2.url } onChange={ ( v ) => setAttributes( { cardButton2: { ...cardButton2, url: v } } ) } type="url" />
				</PanelBody>

				<PanelBody title={ __( 'Stats', 'nordic-fund-day' ) } initialOpen={ false }>
					{ stats.map( ( stat, idx ) => (
						<div key={ stat.id } style={ { display: 'flex', gap: '8px', marginBottom: '8px' } }>
							<TextControl label={ __( 'Value', 'nordic-fund-day' ) } value={ stat.value } onChange={ ( v ) => updateStat( idx, { value: v } ) } style={ { flex: 1 } } />
							<TextControl label={ __( 'Label', 'nordic-fund-day' ) } value={ stat.label } onChange={ ( v ) => updateStat( idx, { label: v } ) } style={ { flex: 1 } } />
						</div>
					) ) }
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="absolute inset-0">
					{ backgroundImage ? (
						<img src={ backgroundImage } alt="" className="w-full h-full object-cover" />
					) : (
						<div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center text-white/30 text-lg">Upload Hero Background</div>
					) }
				</div>

				<div className="relative z-10 flex flex-col w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-[5vw] lg:px-[90px] pt-[120px] sm:pt-[7vw] md:pt-[10.3vw] pb-[15vw] sm:pb-[20vw] md:pb-[15vw] lg:pb-[150px]">
					<div className="flex flex-col items-start gap-3 md:gap-4">
						<div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/20 border border-white/50">
							<span className="text-white text-[11px] sm:text-[14px] font-bold tracking-[0.29em] uppercase">{ dateBadge }</span>
						</div>
						<div className="flex flex-col gap-0 sm:gap-1 overflow-hidden">
							{ titleLines.map( ( line ) => (
								<h1 key={ line.id } className="text-[36px] sm:text-[56px] md:text-[72px] lg:text-[80px] xl:text-[90px] min-[1400px]:text-[110px] min-[1600px]:text-[140px] font-black leading-[0.85] uppercase text-white">
									{ line.text }
								</h1>
							) ) }
						</div>
						<div className="flex items-stretch gap-2 sm:gap-4 mt-2 sm:mt-4">
							<div className="flex flex-col gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-6 w-[140px] sm:w-[195px] bg-[var(--wp--preset--color--lime)]">
								<div className="flex items-center justify-between w-full">
									<span className="text-[var(--wp--preset--color--dark-olive)] text-[10px] sm:text-[12px] font-bold tracking-[0.12em] uppercase">{ primaryCta.label }</span>
								</div>
								<span className="text-[var(--wp--preset--color--dark-olive)] text-[16px] sm:text-[24px] font-semibold leading-none tracking-[-0.07em]">{ primaryCta.sublabel }</span>
							</div>
							<div className="flex flex-col gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-6 w-[140px] sm:w-[195px] border border-white/50 bg-white/30 backdrop-blur-[2px]">
								<div className="flex items-center justify-between w-full">
									<span className="text-white text-[10px] sm:text-[12px] font-bold tracking-[0.12em] uppercase">{ secondaryCta.label }</span>
								</div>
								<span className="text-white text-[16px] sm:text-[24px] font-semibold leading-none tracking-[-0.07em]">{ secondaryCta.sublabel }</span>
							</div>
						</div>
					</div>

					<div className="h-[60px] sm:h-[80px] md:h-[60px] lg:h-[80px] xl:h-[120px] min-[1600px]:h-[360px]"></div>

					<div className="relative z-10 flex flex-col items-end gap-3 lg:gap-6 w-full lg:self-end lg:max-w-[55%]">
						<div className="flex items-center flex-wrap justify-end gap-4 sm:gap-5 lg:gap-[21px]">
							{ partnerLogos.map( ( logo ) => (
								logo.url ? <img key={ logo.id } src={ logo.url } alt={ logo.alt } className="h-[28px] sm:h-[40px] lg:h-[56px] w-auto max-w-[100px] sm:max-w-[120px] lg:max-w-[150px] object-contain" /> : null
							) ) }
						</div>
						<div className="w-full bg-black/10 backdrop-blur-md border border-white/30 rounded-[10px] p-4 sm:p-[30px_40px]">
							<div className="flex flex-col items-end gap-4 sm:gap-8">
								<RichText tagName="p" value={ cardText } onChange={ ( v ) => setAttributes( { cardText: v } ) } className="text-white text-[16px] sm:text-[20px] lg:text-[24px] font-medium leading-[1.2] text-right" placeholder={ __( 'Card text…', 'nordic-fund-day' ) } />
								<div className="flex flex-row items-center gap-2 sm:gap-3">
									<div className="inline-flex items-center justify-center px-3 sm:px-6 py-2.5 sm:py-4 h-[40px] sm:h-[48px] bg-black rounded-full text-white text-[11px] sm:text-[14px] lg:text-[16px] font-semibold uppercase tracking-[0.03em] whitespace-nowrap">{ cardButton1.label }</div>
									<div className="inline-flex items-center justify-center px-3 sm:px-6 py-2.5 sm:py-4 h-[40px] sm:h-[48px] bg-white rounded-full text-black text-[11px] sm:text-[14px] lg:text-[16px] font-semibold uppercase tracking-[0.03em] whitespace-nowrap">{ cardButton2.label }</div>
								</div>
							</div>
						</div>
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
		</>
	);
}
