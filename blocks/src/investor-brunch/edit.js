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
	const { subtitle, heading, dateInfo, description, image, imageId, imageAlt, labelLine1, labelLine2, badges, ctaLabel, ctaUrl, ctaOpenInNewTab } = attributes;

	const blockProps = useBlockProps( {
		className: 'bg-white relative z-[2]',
	} );

	const updateBadge = ( index, fields ) => {
		const updated = [ ...badges ];
		updated[ index ] = { ...updated[ index ], ...fields };
		setAttributes( { badges: updated } );
	};

	const addBadge = () => {
		const newId = badges.length > 0 ? Math.max( ...badges.map( ( b ) => b.id ) ) + 1 : 1;
		setAttributes( {
			badges: [ ...badges, { id: newId, text: __( 'New badge', 'agent-theme' ), iconSvg: '' } ],
		} );
	};

	const removeBadge = ( index ) => {
		if ( badges.length <= 1 ) return;
		setAttributes( { badges: badges.filter( ( _, i ) => i !== index ) } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Image', 'agent-theme' ) } initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { image: media.url, imageId: media.id, imageAlt: media.alt || imageAlt } ) }
							allowedTypes={ [ 'image' ] }
							value={ imageId }
							render={ ( { open } ) => (
								<>
									{ image && <img src={ image } alt="" style={ { width: '100%', height: 'auto', marginBottom: '8px', borderRadius: '4px' } } /> }
									<Button onClick={ open } variant="secondary" style={ { width: '100%' } }>
										{ image ? __( 'Change Image', 'agent-theme' ) : __( 'Upload Image', 'agent-theme' ) }
									</Button>
								</>
							) }
						/>
					</MediaUploadCheck>
					{ image && (
						<Button onClick={ () => setAttributes( { image: '', imageId: 0 } ) } variant="link" isDestructive style={ { marginTop: '4px' } }>
							{ __( 'Remove', 'agent-theme' ) }
						</Button>
					) }
					<TextControl label={ __( 'Alt Text', 'agent-theme' ) } value={ imageAlt } onChange={ ( v ) => setAttributes( { imageAlt: v } ) } />
				</PanelBody>

				<PanelBody title={ __( 'Content', 'agent-theme' ) } initialOpen={ false }>
					<TextControl label={ __( 'Date Info', 'agent-theme' ) } value={ dateInfo } onChange={ ( v ) => setAttributes( { dateInfo: v } ) } />
					<TextControl label={ __( 'Label Line 1', 'agent-theme' ) } value={ labelLine1 } onChange={ ( v ) => setAttributes( { labelLine1: v } ) } />
					<TextControl label={ __( 'Label Line 2', 'agent-theme' ) } value={ labelLine2 } onChange={ ( v ) => setAttributes( { labelLine2: v } ) } />
				</PanelBody>

				<PanelBody title={ __( 'CTA Button', 'agent-theme' ) } initialOpen={ false }>
					<TextControl label={ __( 'Label', 'agent-theme' ) } value={ ctaLabel } onChange={ ( v ) => setAttributes( { ctaLabel: v } ) } />
					<TextControl label={ __( 'URL', 'agent-theme' ) } value={ ctaUrl } onChange={ ( v ) => setAttributes( { ctaUrl: v } ) } type="url" />
					<ToggleControl label={ __( 'Open in new tab', 'agent-theme' ) } checked={ ctaOpenInNewTab } onChange={ ( v ) => setAttributes( { ctaOpenInNewTab: v } ) } />
				</PanelBody>

				<PanelBody title={ __( 'Feature Badges', 'agent-theme' ) } initialOpen={ false }>
					{ badges.map( ( badge, idx ) => (
						<PanelBody key={ badge.id } title={ badge.text || `Badge ${ idx + 1 }` } initialOpen={ false }>
							<TextControl label={ __( 'Text', 'agent-theme' ) } value={ badge.text } onChange={ ( v ) => updateBadge( idx, { text: v } ) } />
							<p style={ { fontWeight: 600, marginTop: '8px', marginBottom: '4px' } }>{ __( 'Icon', 'agent-theme' ) }</p>
							{ badge.iconUrl && <img src={ badge.iconUrl } alt="" style={ { width: '32px', height: '32px', objectFit: 'contain', marginBottom: '8px' } } /> }
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => updateBadge( idx, { iconUrl: media.url, iconId: media.id } ) }
									allowedTypes={ [ 'image' ] }
									value={ badge.iconId }
									render={ ( { open } ) => (
										<Button onClick={ open } variant="secondary" style={ { width: '100%' } }>
											{ badge.iconUrl ? __( 'Change Icon', 'agent-theme' ) : __( 'Upload Icon', 'agent-theme' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							{ badge.iconUrl && (
								<Button onClick={ () => updateBadge( idx, { iconUrl: '', iconId: 0 } ) } variant="link" isDestructive style={ { marginTop: '4px' } }>
									{ __( 'Reset to Default SVG', 'agent-theme' ) }
								</Button>
							) }
							{ badges.length > 1 && (
								<Button onClick={ () => removeBadge( idx ) } variant="secondary" isDestructive style={ { width: '100%', marginTop: '8px' } }>
									{ __( 'Remove Badge', 'agent-theme' ) }
								</Button>
							) }
						</PanelBody>
					) ) }
					<Button onClick={ addBadge } variant="secondary" style={ { width: '100%', marginTop: '8px' } }>
						{ __( '+ Add Badge', 'agent-theme' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="flex flex-col-reverse lg:flex-row items-start gap-8 lg:gap-[106px] px-4 sm:px-6 md:px-16 lg:px-[90px] py-16 lg:py-[132px]">
					<div className="flex flex-col gap-12 w-full lg:max-w-[634px]">
						<div className="flex flex-col gap-4">
							<RichText tagName="span" value={ subtitle } onChange={ ( v ) => setAttributes( { subtitle: v } ) } className="font-mono text-[14px] font-medium tracking-[0.1em] uppercase text-black" placeholder={ __( 'Subtitle…', 'agent-theme' ) } />
							<RichText tagName="h2" value={ heading } onChange={ ( v ) => setAttributes( { heading: v } ) } className="text-[40px] sm:text-[52px] md:text-[56px] lg:text-[56px] xl:text-[64px] min-[1600px]:text-[72px] font-bold leading-[0.95] uppercase text-black" placeholder={ __( 'Heading…', 'agent-theme' ) } />
							<span className="text-black text-[18px] sm:text-[20px] font-bold">{ dateInfo }</span>
							<RichText tagName="div" value={ description } onChange={ ( v ) => setAttributes( { description: v } ) } className="font-mono text-[15px] sm:text-[16px] leading-[1.4] text-black/70 space-y-4 mt-2" placeholder={ __( 'Description…', 'agent-theme' ) } multiline="p" />
						</div>

						<div className="flex flex-col gap-[14px]">
							{ badges.map( ( badge ) => (
								<div key={ badge.id } className="flex items-center gap-3 p-2 sm:p-3 bg-black border border-white/[0.08] rounded">
									<div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-[var(--wp--preset--color--lime)]">
									{ badge.iconUrl ? (
										<img src={ badge.iconUrl } alt="" className="w-6 h-6 object-contain" />
									) : (
										<span dangerouslySetInnerHTML={ { __html: badge.iconSvg } } />
									) }
								</div>
									<span className="text-white text-[16px] font-bold leading-[1.5]">{ badge.text }</span>
								</div>
							) ) }
						</div>

						<div className="inline-flex items-center px-8 py-4 bg-[var(--wp--preset--color--lime-cta)] rounded-full text-black font-semibold text-base w-fit">
							{ ctaLabel }
						</div>
					</div>

					<div className="relative w-full lg:w-[52%] flex-shrink-0">
						<div className="h-[40px] sm:h-[60px] lg:h-[80px]"></div>
						<div className="absolute top-0 right-0 bg-[var(--wp--preset--color--lime)] rounded-sm w-[calc(100%-30px)] sm:w-[calc(100%-50px)] lg:w-[calc(100%-75px)] h-full"></div>
						<div className="relative z-[1] mr-[30px] sm:mr-[50px] lg:mr-[75px]" style={ { aspectRatio: '921/683' } }>
							{ image ? (
								<img src={ image } alt={ imageAlt } className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full bg-[var(--wp--preset--color--lime)]/30 flex items-center justify-center text-black/30">Upload Image</div>
							) }
						</div>
						<div className="relative z-[1] flex flex-col items-end gap-[2px] pr-8 py-5">
							<span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-black">{ labelLine1 }</span>
							<span className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-black">{ labelLine2 }</span>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
