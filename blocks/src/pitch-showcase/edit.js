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
	TextareaControl,
	ToggleControl,
	Button,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { backgroundImage, backgroundImageId, subtitle, heading, dateInfo, descriptionText, ctaLabel, ctaUrl, ctaOpenInNewTab, sectors } = attributes;

	const blockProps = useBlockProps( {
		className: 'relative min-h-[600px] md:min-h-[1000px] flex items-end overflow-hidden',
	} );

	const updateSector = ( index, fields ) => {
		const updated = [ ...sectors ];
		updated[ index ] = { ...updated[ index ], ...fields };
		setAttributes( { sectors: updated } );
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
										{ backgroundImage ? __( 'Change Image', 'nordic-fund-day' ) : __( 'Upload Image', 'nordic-fund-day' ) }
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

				<PanelBody title={ __( 'Content', 'nordic-fund-day' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Date Info', 'nordic-fund-day' ) }
						value={ dateInfo }
						onChange={ ( value ) => setAttributes( { dateInfo: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'CTA Button', 'nordic-fund-day' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Label', 'nordic-fund-day' ) }
						value={ ctaLabel }
						onChange={ ( value ) => setAttributes( { ctaLabel: value } ) }
					/>
					<TextControl
						label={ __( 'URL', 'nordic-fund-day' ) }
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

				<PanelBody title={ __( 'Sector Cards', 'nordic-fund-day' ) } initialOpen={ false }>
					{ sectors.map( ( sector, idx ) => (
						<PanelBody key={ sector.id } title={ sector.title || `Sector ${ idx + 1 }` } initialOpen={ false }>
							<TextControl
								label={ __( 'Title', 'nordic-fund-day' ) }
								value={ sector.title }
								onChange={ ( value ) => updateSector( idx, { title: value } ) }
							/>
							<TextareaControl
								label={ __( 'Description', 'nordic-fund-day' ) }
								value={ sector.description }
								onChange={ ( value ) => updateSector( idx, { description: value } ) }
							/>
							<p style={ { fontWeight: 600, marginTop: '8px', marginBottom: '4px' } }>{ __( 'Icon', 'nordic-fund-day' ) }</p>
							{ sector.iconUrl && <img src={ sector.iconUrl } alt="" style={ { width: '32px', height: '32px', objectFit: 'contain', marginBottom: '8px' } } /> }
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => updateSector( idx, { iconUrl: media.url, iconId: media.id } ) }
									allowedTypes={ [ 'image' ] }
									value={ sector.iconId }
									render={ ( { open } ) => (
										<Button onClick={ open } variant="secondary" style={ { width: '100%' } }>
											{ sector.iconUrl ? __( 'Change Icon', 'nordic-fund-day' ) : __( 'Upload Icon', 'nordic-fund-day' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							{ sector.iconUrl && (
								<Button onClick={ () => updateSector( idx, { iconUrl: '', iconId: 0 } ) } variant="link" isDestructive style={ { marginTop: '4px' } }>
									{ __( 'Reset to Default', 'nordic-fund-day' ) }
								</Button>
							) }
						</PanelBody>
					) ) }
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="absolute inset-0">
					{ backgroundImage ? (
						<img src={ backgroundImage } alt="" className="w-full h-full object-cover object-top" />
					) : (
						<div className="w-full h-full bg-black/70 flex items-center justify-center text-white/30">Background Image</div>
					) }
				</div>

				<div className="relative z-10 flex flex-col justify-end h-full px-4 sm:px-6 md:px-[90px] py-8 md:py-12 lg:py-16">
					<div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-12 mb-8">
						<div className="flex flex-col gap-4 max-w-[642px]">
							<RichText
								tagName="span"
								value={ subtitle }
								onChange={ ( value ) => setAttributes( { subtitle: value } ) }
								className="font-mono text-[14px] font-medium tracking-[0.1em] uppercase text-white"
								placeholder={ __( 'Subtitle…', 'nordic-fund-day' ) }
							/>
							<RichText
								tagName="h2"
								value={ heading }
								onChange={ ( value ) => setAttributes( { heading: value } ) }
								className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[56px] xl:text-[64px] font-bold leading-[1] uppercase text-white"
								placeholder={ __( 'Heading…', 'nordic-fund-day' ) }
							/>
							<span className="text-white text-[20px] sm:text-[24px] font-bold">{ dateInfo }</span>
						</div>
						<div className="bg-black/20 backdrop-blur-md rounded-lg p-5 sm:p-7 max-w-[520px] w-full lg:w-[520px] border border-white/10">
							<RichText
								tagName="p"
								value={ descriptionText }
								onChange={ ( value ) => setAttributes( { descriptionText: value } ) }
								className="font-mono text-[14px] sm:text-[16px] leading-[1.4] text-white mb-5"
								placeholder={ __( 'Description…', 'nordic-fund-day' ) }
							/>
							<div className="inline-flex items-center justify-center px-6 py-3 bg-white rounded-full text-black text-[14px] sm:text-[16px] font-semibold uppercase tracking-[0.03em]">
								{ ctaLabel }
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pb-2">
						{ sectors.map( ( sector ) => (
							<div key={ sector.id } className="bg-[var(--wp--preset--color--dark-card)] rounded-[5px] p-6 sm:p-7 flex flex-col gap-4">
								<div className="w-10 h-10 flex items-center justify-center text-[var(--wp--preset--color--lime)]">
									{ sector.iconUrl ? (
										<img src={ sector.iconUrl } alt="" className="w-8 h-8 object-contain" />
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
		</>
	);
}
