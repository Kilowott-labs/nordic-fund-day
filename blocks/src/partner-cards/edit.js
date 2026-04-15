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
	ToggleControl,
	Button,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { subtitle, heading, description, ctaLabel, ctaUrl, ctaOpenInNewTab, contactImage, contactImageId, contactName, contactTitle, contactCompany, contactEmail, contactPhone } = attributes;

	const blockProps = useBlockProps( {
		className: 'bg-black px-4 sm:px-6 md:px-16 lg:px-[90px] py-16 md:py-24 lg:py-[120px]',
	} );

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

				<PanelBody title={ __( 'Contact', 'nordic-fund-day' ) } initialOpen={ false }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { contactImage: media.url, contactImageId: media.id } ) }
							allowedTypes={ [ 'image' ] }
							value={ contactImageId }
							render={ ( { open } ) => (
								<>
									{ contactImage && (
										<img src={ contactImage } alt="" style={ { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px' } } />
									) }
									<Button onClick={ open } variant="secondary" style={ { width: '100%', marginBottom: '4px' } }>
										{ contactImage ? __( 'Change Photo', 'nordic-fund-day' ) : __( 'Upload Photo', 'nordic-fund-day' ) }
									</Button>
								</>
							) }
						/>
					</MediaUploadCheck>
					{ contactImage && (
						<Button onClick={ () => setAttributes( { contactImage: '', contactImageId: 0 } ) } variant="link" isDestructive style={ { marginBottom: '12px' } }>
							{ __( 'Remove Photo', 'nordic-fund-day' ) }
						</Button>
					) }
					<TextControl
						label={ __( 'Name', 'nordic-fund-day' ) }
						value={ contactName }
						onChange={ ( value ) => setAttributes( { contactName: value } ) }
					/>
					<TextControl
						label={ __( 'Title', 'nordic-fund-day' ) }
						value={ contactTitle }
						onChange={ ( value ) => setAttributes( { contactTitle: value } ) }
					/>
					<TextControl
						label={ __( 'Company', 'nordic-fund-day' ) }
						value={ contactCompany }
						onChange={ ( value ) => setAttributes( { contactCompany: value } ) }
					/>
					<TextControl
						label={ __( 'Email', 'nordic-fund-day' ) }
						value={ contactEmail }
						onChange={ ( value ) => setAttributes( { contactEmail: value } ) }
						type="email"
					/>
					<TextControl
						label={ __( 'Phone', 'nordic-fund-day' ) }
						value={ contactPhone }
						onChange={ ( value ) => setAttributes( { contactPhone: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="flex flex-col lg:flex-row gap-12 lg:gap-12 xl:gap-16 lg:items-stretch">
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

					{ /* Right Column — Contact Card */ }
					<div className="flex flex-col sm:flex-row gap-5 flex-1">
						<div className="flex-1 bg-[var(--wp--preset--color--dark-card)] border border-white/[0.15] rounded-lg overflow-hidden">
							<div className="p-7 sm:p-9 border-b border-white/[0.15]">
								<div className="flex items-center gap-5">
									{ contactImage && (
										<img src={ contactImage } alt={ contactName } className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full object-cover flex-shrink-0 border-2 border-white/10" />
									) }
									<div>
										<span className="text-[var(--wp--preset--color--lime)] text-[15px] font-medium font-mono">Contact Us</span>
										<span className="text-white text-[28px] sm:text-[34px] lg:text-[38px] font-bold leading-[1.1] tracking-tight block mt-1">{ contactName }</span>
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-4 p-7 sm:p-9 font-mono">
								<div className="flex items-center gap-3">
									<span className="text-white/40 text-[13px] w-5 flex-shrink-0">✦</span>
									<span className="text-white text-[16px] leading-[1.5]">{ contactTitle }</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-white/40 text-[13px] w-5 flex-shrink-0">✦</span>
									<span className="text-white text-[16px] leading-[1.5]">{ contactCompany }</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-[var(--wp--preset--color--lime)] text-[15px] w-5 flex-shrink-0">✉</span>
									<span className="text-[var(--wp--preset--color--lime)] text-[16px] leading-[1.5]">{ contactEmail }</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-white/40 text-[15px] w-5 flex-shrink-0">✆</span>
									<span className="text-white text-[16px] leading-[1.5]">{ contactPhone }</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
