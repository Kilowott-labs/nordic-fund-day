import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	PanelColorSettings,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';

// Default SVG icons from Figma nodes 1:5, 1:17, 1:25
// clipPath IDs scoped per item to avoid conflicts across multiple block instances
function UspIcon( { icon, itemId } ) {
	const clipId = `clip-usp-edit-${ itemId }-${ icon }`;

	if ( icon === 'certification' ) {
		return (
			<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clipPath={ `url(#${ clipId })` }>
					<path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					<path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					<path d="M24.5 21C27.5376 21 30 18.5376 30 15.5C30 12.4624 27.5376 10 24.5 10C21.4624 10 19 12.4624 19 15.5C19 18.5376 21.4624 21 24.5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					<path d="M21 24H5C4.73478 24 4.48043 23.8946 4.29289 23.7071C4.10536 23.5196 4 23.2652 4 23V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H27C27.2652 6 27.5196 6.10536 27.7071 6.29289C27.8946 6.48043 28 6.73478 28 7V11.2575" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					<path d="M21 19.7422V27.9997L24.5 25.9997L28 27.9997V19.7422" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				</g>
				<defs><clipPath id={ clipId }><rect width="32" height="32" fill="white"/></clipPath></defs>
			</svg>
		);
	}

	if ( icon === 'quality' ) {
		return (
			<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clipPath={ `url(#${ clipId })` }>
					<path d="M6.8075 25.1925C5.6575 24.0425 6.42 21.6263 5.835 20.2113C5.2275 18.75 3 17.5625 3 16C3 14.4375 5.2275 13.25 5.835 11.7887C6.42 10.375 5.6575 7.9575 6.8075 6.8075C7.9575 5.6575 10.375 6.42 11.7887 5.835C13.2562 5.2275 14.4375 3 16 3C17.5625 3 18.75 5.2275 20.2113 5.835C21.6263 6.42 24.0425 5.6575 25.1925 6.8075C26.3425 7.9575 25.58 10.3737 26.165 11.7887C26.7725 13.2562 29 14.4375 29 16C29 17.5625 26.7725 18.75 26.165 20.2113C25.58 21.6263 26.3425 24.0425 25.1925 25.1925C24.0425 26.3425 21.6263 25.58 20.2113 26.165C18.75 26.7725 17.5625 29 16 29C14.4375 29 13.25 26.7725 11.7887 26.165C10.375 25.58 7.9575 26.3425 6.8075 25.1925Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					<path d="M11 17L14 20L21 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				</g>
				<defs><clipPath id={ clipId }><rect width="32" height="32" fill="white"/></clipPath></defs>
			</svg>
		);
	}

	// co2
	return (
		<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath={ `url(#${ clipId })` }>
				<path d="M16 29V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M16 19L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M16 16L22 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M16 22.2425C17.4734 23.4249 19.3191 24.0452 21.2075 23.9925C25.4488 23.885 29.0113 20.215 29 15.9725C28.9955 14.3798 28.5157 12.8247 27.622 11.5064C26.7284 10.1881 25.4615 9.16649 23.9838 8.57248C23.3857 6.93576 22.2991 5.52239 20.8711 4.52379C19.443 3.52519 17.7426 2.98962 16 2.98962C14.2575 2.98962 12.557 3.52519 11.129 4.52379C9.70093 5.52239 8.61431 6.93576 8.01628 8.57248C6.53773 9.16681 5.27036 10.1892 4.37664 11.5085C3.48292 12.8278 3.00356 14.384 3.00003 15.9775C2.98878 20.22 6.55253 23.89 10.7938 23.9975C12.6824 24.0486 14.5277 23.4265 16 22.2425Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			</g>
			<defs><clipPath id={ clipId }><rect width="32" height="32" fill="white"/></clipPath></defs>
		</svg>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { sectionBgColor, textColor, items } = attributes;

	const blockProps = useBlockProps( {
		className: `w-full py-5 overflow-hidden${ ! sectionBgColor ? ' bg-[var(--wp--preset--color--white)]' : '' }`,
		style: sectionBgColor ? { backgroundColor: sectionBgColor } : undefined,
	} );

	const updateItem = ( index, fields ) => {
		const updated = [ ...items ];
		updated[ index ] = { ...updated[ index ], ...fields };
		setAttributes( { items: updated } );
	};

	const addItem = () => {
		const newId =
			items.length > 0
				? Math.max( ...items.map( ( i ) => i.id ) ) + 1
				: 1;
		setAttributes( {
			items: [
				...items,
				{
					id: newId,
					icon: 'certification',
					iconUrl: '',
					iconId: 0,
					iconAlt: '',
					title: __( 'New USP', 'agent-theme' ),
					description: __( 'Describe this USP here.', 'agent-theme' ),
				},
			],
		} );
	};

	const removeItem = ( index ) => {
		if ( items.length <= 1 ) return;
		setAttributes( { items: items.filter( ( _, i ) => i !== index ) } );
	};

	return (
		<>
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Colors', 'agent-theme' ) }
					initialOpen={ true }
					colorSettings={ [
						{
							value: sectionBgColor,
							onChange: ( value ) =>
								setAttributes( { sectionBgColor: value } ),
							label: __( 'Section Background', 'agent-theme' ),
						},
						{
							value: textColor,
							onChange: ( value ) =>
								setAttributes( { textColor: value } ),
							label: __( 'Text & Icon Color', 'agent-theme' ),
						},
					] }
				/>

				<PanelBody
					title={ __( 'USP Items', 'agent-theme' ) }
					initialOpen={ true }
				>
					{ items.map( ( item, index ) => (
						<PanelBody
							key={ item.id }
							title={
								item.title ||
								`${ __( 'Item', 'agent-theme' ) } ${ index + 1 }`
							}
							initialOpen={ index === 0 }
						>
							{ /* Icon uploader — default SVG shown as preview until replaced */ }
							<p style={ { marginBottom: '8px', fontWeight: 600 } }>
								{ __( 'Icon', 'agent-theme' ) }
							</p>
							{ item.iconUrl ? (
								<img
									src={ item.iconUrl }
									alt={ item.iconAlt || '' }
									style={ {
										width: '48px',
										height: '48px',
										objectFit: 'contain',
										display: 'block',
										marginBottom: '8px',
									} }
								/>
							) : (
								<div
									style={ {
										width: '48px',
										height: '48px',
										marginBottom: '8px',
										color: '#333',
									} }
								>
									<UspIcon icon={ item.icon } itemId={ `sidebar-${ item.id }` } />
								</div>
							) }
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										updateItem( index, {
											iconUrl: media.url,
											iconId: media.id,
											iconAlt: media.alt || '',
										} )
									}
									allowedTypes={ [ 'image' ] }
									value={ item.iconId }
									render={ ( { open } ) => (
										<Button
											onClick={ open }
											variant="secondary"
											style={ { width: '100%' } }
										>
											{ item.iconUrl
												? __( 'Change Icon', 'agent-theme' )
												: __( 'Upload Icon', 'agent-theme' ) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
							{ item.iconUrl && (
								<>
									<Button
										onClick={ () =>
											updateItem( index, {
												iconUrl: '',
												iconId: 0,
												iconAlt: '',
											} )
										}
										variant="link"
										isDestructive
										style={ { marginTop: '4px' } }
									>
										{ __( 'Reset to Default Icon', 'agent-theme' ) }
									</Button>
									<TextControl
										label={ __( 'Icon Alt Text', 'agent-theme' ) }
										value={ item.iconAlt }
										onChange={ ( value ) =>
											updateItem( index, { iconAlt: value } )
										}
										help={ __(
											'Leave empty if icon is decorative.',
											'agent-theme'
										) }
										style={ { marginTop: '8px' } }
									/>
								</>
							) }

							{ items.length > 1 && (
								<Button
									onClick={ () => removeItem( index ) }
									variant="secondary"
									isDestructive
									style={ { marginTop: '12px', width: '100%' } }
								>
									{ __( 'Remove Item', 'agent-theme' ) }
								</Button>
							) }
						</PanelBody>
					) ) }
					<Button
						onClick={ addItem }
						variant="primary"
						style={ { width: '100%', marginTop: '8px' } }
					>
						{ __( '+ Add Item', 'agent-theme' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			{ /* Editor canvas */ }
			<section { ...blockProps }>
				<div className="max-w-[75rem] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-8 md:gap-x-12 lg:gap-x-[5.5rem] place-items-center">
					{ items.map( ( item, index ) => (
						<div
							key={ item.id }
							className="flex flex-col items-center text-center gap-[1.375rem] w-full max-w-[20.5rem]"
							style={ textColor ? { color: textColor } : undefined }
						>
							<div
								className={ `w-8 h-8${ ! textColor ? ' text-[var(--wp--preset--color--near-black)]' : '' }` }
								aria-hidden="true"
							>
								{ item.iconUrl ? (
									<img
										src={ item.iconUrl }
										alt={ item.iconAlt || '' }
										className="w-full h-full object-contain"
										loading="lazy"
									/>
								) : (
									<UspIcon icon={ item.icon } itemId={ item.id } />
								) }
							</div>
							<RichText
								tagName="h3"
								value={ item.title }
								onChange={ ( value ) =>
									updateItem( index, { title: value } )
								}
								className={ `text-[1.25rem] font-semibold leading-tight tracking-[-0.01em] font-[family-name:var(--wp--preset--font-family--dm-sans)] m-0${ ! textColor ? ' text-[var(--wp--preset--color--near-black)]' : '' }` }
								placeholder={ __( 'Enter title…', 'agent-theme' ) }
							/>
							<RichText
								tagName="p"
								value={ item.description }
								onChange={ ( value ) =>
									updateItem( index, { description: value } )
								}
								className={ `text-[0.9375rem] font-normal leading-6 font-[family-name:var(--wp--preset--font-family--dm-sans)] m-0${ ! textColor ? ' text-[var(--wp--preset--color--near-black)]' : '' }` }
								placeholder={ __( 'Enter description…', 'agent-theme' ) }
							/>
						</div>
					) ) }
				</div>
			</section>
		</>
	);
}
