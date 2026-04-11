import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	Button,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { logo, logoId, logoAlt, navLinks, ctaLabel, ctaUrl } = attributes;

	const blockProps = useBlockProps( {
		className: 'fixed top-0 left-0 right-0 z-50 bg-transparent',
	} );

	const updateLink = ( index, fields ) => {
		const updated = [ ...navLinks ];
		updated[ index ] = { ...updated[ index ], ...fields };
		setAttributes( { navLinks: updated } );
	};

	const addLink = () => {
		const newId = navLinks.length > 0 ? Math.max( ...navLinks.map( ( l ) => l.id ) ) + 1 : 1;
		setAttributes( {
			navLinks: [ ...navLinks, { id: newId, label: __( 'New Link', 'nordic-fund-day' ), url: '#' } ],
		} );
	};

	const removeLink = ( index ) => {
		if ( navLinks.length <= 1 ) return;
		setAttributes( { navLinks: navLinks.filter( ( _, i ) => i !== index ) } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Logo', 'nordic-fund-day' ) } initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { logo: media.url, logoId: media.id } ) }
							allowedTypes={ [ 'image' ] }
							value={ logoId }
							render={ ( { open } ) => (
								<>
									{ logo && <img src={ logo } alt="" style={ { maxHeight: '64px', marginBottom: '8px' } } /> }
									<Button onClick={ open } variant="secondary" style={ { width: '100%' } }>
										{ logo ? __( 'Change Logo', 'nordic-fund-day' ) : __( 'Upload Logo', 'nordic-fund-day' ) }
									</Button>
								</>
							) }
						/>
					</MediaUploadCheck>
					{ logo && (
						<Button onClick={ () => setAttributes( { logo: '', logoId: 0 } ) } variant="link" isDestructive style={ { marginTop: '4px' } }>
							{ __( 'Remove', 'nordic-fund-day' ) }
						</Button>
					) }
					<TextControl label={ __( 'Logo Alt Text', 'nordic-fund-day' ) } value={ logoAlt } onChange={ ( v ) => setAttributes( { logoAlt: v } ) } />
				</PanelBody>

				<PanelBody title={ __( 'Navigation Links', 'nordic-fund-day' ) } initialOpen={ true }>
					{ navLinks.map( ( link, idx ) => (
						<div key={ link.id } style={ { marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #ddd' } }>
							<TextControl label={ __( 'Label', 'nordic-fund-day' ) } value={ link.label } onChange={ ( v ) => updateLink( idx, { label: v } ) } />
							<TextControl label={ __( 'URL / Anchor', 'nordic-fund-day' ) } value={ link.url } onChange={ ( v ) => updateLink( idx, { url: v } ) } help={ __( 'Use #section-id for scroll links', 'nordic-fund-day' ) } />
							{ navLinks.length > 1 && (
								<Button onClick={ () => removeLink( idx ) } variant="secondary" isDestructive style={ { width: '100%', marginTop: '4px' } }>
									{ __( 'Remove', 'nordic-fund-day' ) }
								</Button>
							) }
						</div>
					) ) }
					<Button onClick={ addLink } variant="secondary" style={ { width: '100%' } }>
						{ __( '+ Add Link', 'nordic-fund-day' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'CTA Button', 'nordic-fund-day' ) } initialOpen={ false }>
					<TextControl label={ __( 'Label', 'nordic-fund-day' ) } value={ ctaLabel } onChange={ ( v ) => setAttributes( { ctaLabel: v } ) } />
					<TextControl label={ __( 'URL', 'nordic-fund-day' ) } value={ ctaUrl } onChange={ ( v ) => setAttributes( { ctaUrl: v } ) } type="url" />
				</PanelBody>
			</InspectorControls>

			{ /* Editor preview — simplified, not fixed position in editor */ }
			<div { ...blockProps } style={ { position: 'relative', background: 'rgba(0,0,0,0.85)' } }>
				<div className="flex items-center justify-between px-4 sm:px-6 md:px-[90px] py-[13px]">
					<div className="flex-shrink-0">
						{ logo ? (
							<img src={ logo } alt={ logoAlt } className="h-[40px] sm:h-[52px] md:h-[64px] w-auto" />
						) : (
							<span className="text-white text-xl font-bold">{ logoAlt }</span>
						) }
					</div>
					<div className="flex items-center gap-[43px]">
						{ navLinks.map( ( link ) => (
							<span key={ link.id } className="text-white text-lg font-bold">{ link.label }</span>
						) ) }
						<span className="inline-flex items-center justify-center px-[19px] py-[9px] bg-white rounded-full text-black text-base font-bold uppercase tracking-[0.05em]">
							{ ctaLabel }
						</span>
					</div>
				</div>
			</div>
		</>
	);
}
