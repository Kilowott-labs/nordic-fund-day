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
	TextareaControl,
	Button,
	ColorPicker,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

// The decorative SVG path shared by all collection items
const COLLECTION_SVG_PATH =
	'M14.9102 0H14.8429C14.7559 0.00841751 14.6689 0.0476992 14.5819 0.115039C14.523 0.154321 14.4753 0.199214 14.4388 0.249719C14.0236 0.664983 13.6308 1.04938 13.2576 1.40292C12.4158 2.17733 11.5264 2.90685 10.5808 3.58586C9.66049 4.26768 8.63636 4.65208 7.50842 4.73345C6.17284 4.68014 4.59035 3.88328 2.76094 2.33726C2.17172 1.83221 1.59933 1.30191 1.04377 0.743547C1.00449 0.704265 0.965208 0.664983 0.928732 0.625701C0.810887 0.505051 0.693042 0.3844 0.578002 0.263749C0.572391 0.258137 0.569585 0.255331 0.563973 0.249719C0.527497 0.199214 0.476992 0.157127 0.420875 0.115039C0.333895 0.0476992 0.246914 0.0112233 0.159933 0H0.0925926C0.03367 0 0.00280584 0.0308642 0.00280584 0.0897868V0.157127C0.016835 0.291807 0.10101 0.426487 0.249719 0.563973C1.5881 1.90236 2.63187 3.08361 3.38384 4.10494C4.27609 5.32548 4.72783 6.45623 4.73625 7.5C4.72783 8.54377 4.27609 9.67452 3.38384 10.8951C2.63187 11.9164 1.5853 13.0976 0.249719 14.436C0.0982043 14.5707 0.016835 14.7054 0.00280584 14.8429V14.9102C0.00280584 14.9691 0.03367 15 0.0925926 15H0.159933C0.246914 14.9916 0.333895 14.9523 0.420875 14.885C0.479798 14.8457 0.527497 14.8008 0.563973 14.7531C0.569585 14.7475 0.572391 14.7447 0.578002 14.7391C0.695847 14.6156 0.810887 14.495 0.928732 14.3771C0.968013 14.3378 1.0073 14.2985 1.04377 14.2593C1.59933 13.7009 2.17172 13.1706 2.76094 12.6655C4.59035 11.1195 6.17284 10.3227 7.50842 10.2694C8.63356 10.3507 9.65769 10.7323 10.5808 11.4169C11.5236 12.096 12.4158 12.8255 13.2576 13.5999C13.6308 13.9534 14.0236 14.3378 14.4388 14.7531C14.4753 14.8036 14.5258 14.8485 14.5819 14.8878C14.6689 14.9523 14.7559 14.9916 14.8429 15.0028H14.9102C14.9691 15.0028 15 14.9719 15 14.913V14.8457C14.986 14.711 14.9018 14.5763 14.7531 14.4388C13.4007 13.1004 12.3541 11.9136 11.619 10.8754C10.7379 9.67172 10.289 8.54938 10.2666 7.50281C10.289 6.45623 10.7379 5.33389 11.619 4.13019C12.3569 3.09203 13.4007 1.90516 14.7531 0.566779C14.9046 0.432099 14.986 0.294613 15 0.159933V0.0925926C15 0.03367 14.9691 0.00280584 14.9102 0.00280584V0Z';

export default function Edit( { attributes, setAttributes } ) {
	const {
		collections,
		rightBgColor,
		activeColor,
		inactiveColor,
		textColor,
		decorativeImage,
		decorativeImageId,
	} = attributes;

	// Local state: which collection is previewed in the editor canvas
	const [ activeIndex, setActiveIndex ] = useState( 0 );

	const blockProps = useBlockProps();

	const activeCollection = collections[ activeIndex ] || collections[ 0 ] || {};

	// Update one or more fields of a collection at a given index atomically
	const updateCollection = ( index, fields ) => {
		const updated = [ ...collections ];
		updated[ index ] = { ...updated[ index ], ...fields };
		setAttributes( { collections: updated } );
	};

	const addCollection = () => {
		const newId =
			collections.length > 0
				? Math.max( ...collections.map( ( c ) => c.id ) ) + 1
				: 1;
		setAttributes( {
			collections: [
				...collections,
				{
					id: newId,
					name: `COLLECTION ${ newId }`,
					season: 'SEASON COLLECTION',
					description1: 'Add your first paragraph description here.',
					description2: 'Add your second paragraph description here.',
					buttonText: 'VIEW COLLECTION',
					buttonUrl: '#',
					image: '',
					imageId: 0,
				},
			],
		} );
	};

	const removeCollection = ( index ) => {
		if ( collections.length <= 1 ) return;
		const updated = collections.filter( ( _, i ) => i !== index );
		setAttributes( { collections: updated } );
		if ( activeIndex >= updated.length ) {
			setActiveIndex( updated.length - 1 );
		}
	};

	const labelStyle = {
		display: 'block',
		marginBottom: '8px',
		fontWeight: 500,
		fontSize: '11px',
		textTransform: 'uppercase',
		color: '#1e1e1e',
	};

	return (
		<>
			{ /* Inspector sidebar */ }
			<InspectorControls>
				{ /* Colors panel */ }
				<PanelBody title={ __( 'Colors', 'ytf' ) } initialOpen={ true }>
					<div style={ { marginBottom: '24px' } }>
						<span style={ labelStyle }>
							{ __( 'Right Panel Background', 'ytf' ) }
						</span>
						<ColorPicker
							color={ rightBgColor }
							onChange={ ( value ) =>
								setAttributes( { rightBgColor: value } )
							}
							enableAlpha={ false }
						/>
					</div>

					<div style={ { marginBottom: '24px' } }>
						<span style={ labelStyle }>
							{ __( 'Active Item Color', 'ytf' ) }
						</span>
						<ColorPicker
							color={ activeColor }
							onChange={ ( value ) =>
								setAttributes( { activeColor: value } )
							}
							enableAlpha={ false }
						/>
					</div>

					<div style={ { marginBottom: '24px' } }>
						<span style={ labelStyle }>
							{ __( 'Inactive Item Color', 'ytf' ) }
						</span>
						<ColorPicker
							color={ inactiveColor }
							onChange={ ( value ) =>
								setAttributes( { inactiveColor: value } )
							}
							enableAlpha={ false }
						/>
					</div>

					<div>
						<span style={ labelStyle }>
							{ __( 'Body / Description Text Color', 'ytf' ) }
						</span>
						<ColorPicker
							color={ textColor }
							onChange={ ( value ) =>
								setAttributes( { textColor: value } )
							}
							enableAlpha={ false }
						/>
					</div>
				</PanelBody>

				{ /* Decorative image panel */ }
				<PanelBody
					title={ __( 'Decorative Watermark Image', 'ytf' ) }
					initialOpen={ false }
				>
					<p
						style={ {
							fontSize: '12px',
							color: '#757575',
							marginBottom: '12px',
						} }
					>
						{ __(
							'Appears bottom-right of the content panel at 20% opacity.',
							'ytf'
						) }
					</p>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									decorativeImage: media.url,
									decorativeImageId: media.id,
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ decorativeImageId }
							render={ ( { open } ) => (
								<div>
									{ decorativeImage && (
										<img
											src={ decorativeImage }
											alt=""
											style={ {
												width: '100%',
												height: 'auto',
												maxHeight: '120px',
												objectFit: 'contain',
												marginBottom: '8px',
												border: '1px solid #ddd',
												borderRadius: '4px',
											} }
										/>
									) }
									<Button onClick={ open } variant="secondary">
										{ decorativeImage
											? __( 'Change Image', 'ytf' )
											: __( 'Select Image', 'ytf' ) }
									</Button>
									{ decorativeImage && (
										<Button
											onClick={ () =>
												setAttributes( {
													decorativeImage: '',
													decorativeImageId: 0,
												} )
											}
											variant="link"
											isDestructive
											style={ { marginLeft: '8px' } }
										>
											{ __( 'Remove', 'ytf' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				{ /* Per-collection panels */ }
				<PanelBody
					title={ __( 'Collections', 'ytf' ) }
					initialOpen={ true }
				>
					{ collections.map( ( collection, index ) => (
						<PanelBody
							key={ collection.id }
							title={
								collection.name ||
								`${ __( 'Collection', 'ytf' ) } ${ index + 1 }`
							}
							initialOpen={ index === 0 }
						>
							<TextControl
								label={ __( 'Collection Name', 'ytf' ) }
								value={ collection.name }
								onChange={ ( value ) =>
									updateCollection( index, { name: value } )
								}
							/>

							<TextControl
								label={ __( 'Season Label', 'ytf' ) }
								value={ collection.season }
								onChange={ ( value ) =>
									updateCollection( index, { season: value } )
								}
							/>

							<TextareaControl
								label={ __( 'Description — Paragraph 1', 'ytf' ) }
								value={ collection.description1 }
								onChange={ ( value ) =>
									updateCollection( index, {
										description1: value,
									} )
								}
								rows={ 3 }
							/>

							<TextareaControl
								label={ __( 'Description — Paragraph 2', 'ytf' ) }
								value={ collection.description2 }
								onChange={ ( value ) =>
									updateCollection( index, {
										description2: value,
									} )
								}
								rows={ 3 }
							/>

							<TextControl
								label={ __( 'Button Text', 'ytf' ) }
								value={ collection.buttonText }
								onChange={ ( value ) =>
									updateCollection( index, {
										buttonText: value,
									} )
								}
							/>

							<TextControl
								label={ __( 'Button URL', 'ytf' ) }
								value={ collection.buttonUrl }
								onChange={ ( value ) =>
									updateCollection( index, {
										buttonUrl: value,
									} )
								}
							/>

							{ /* Collection image */ }
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										updateCollection( index, {
											image: media.url,
											imageId: media.id,
										} )
									}
									allowedTypes={ [ 'image' ] }
									value={ collection.imageId }
									render={ ( { open } ) => (
										<div
											style={ {
												marginTop: '8px',
												marginBottom: '8px',
											} }
										>
											<p
												style={ {
													...labelStyle,
													marginBottom: '6px',
												} }
											>
												{ __(
													'Collection Image',
													'ytf'
												) }
											</p>
											{ collection.image && (
												<img
													src={ collection.image }
													alt={ collection.name }
													style={ {
														width: '100%',
														height: '120px',
														objectFit: 'cover',
														marginBottom: '8px',
														borderRadius: '4px',
														border:
															'1px solid #ddd',
													} }
												/>
											) }
											<div>
												<Button
													onClick={ open }
													variant="secondary"
												>
													{ collection.image
														? __(
																'Change Image',
																'ytf'
														  )
														: __(
																'Select Image',
																'ytf'
														  ) }
												</Button>
												{ collection.image && (
													<Button
														onClick={ () =>
															updateCollection(
																index,
																{
																	image: '',
																	imageId: 0,
																}
															)
														}
														variant="link"
														isDestructive
														style={ {
															marginLeft: '8px',
														} }
													>
														{ __(
															'Remove',
															'ytf'
														) }
													</Button>
												) }
											</div>
										</div>
									) }
								/>
							</MediaUploadCheck>

							{ collections.length > 1 && (
								<Button
									onClick={ () => removeCollection( index ) }
									variant="secondary"
									isDestructive
									style={ { marginTop: '12px' } }
								>
									{ __( 'Remove Collection', 'ytf' ) }
								</Button>
							) }
						</PanelBody>
					) ) }

					<Button
						onClick={ addCollection }
						variant="primary"
						style={ { width: '100%', marginTop: '8px' } }
					>
						{ __( '+ Add Collection', 'ytf' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			{ /* ── Editor canvas — identical structure and classes to save.js ── */ }
			<div { ...blockProps }>
				<div className="relative w-full flex flex-col lg:flex-row">

					{ /* Left — sticky image panel (same classes as save.js) */ }
					<div className="w-full lg:w-1/2 h-[60vh] lg:h-screen bg-[#c2c2c2] lg:sticky lg:top-0">
						{ activeCollection.image ? (
							<img
								src={ activeCollection.image }
								alt={ activeCollection.name || '' }
								className="w-full h-full object-cover fade-transition"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-[#c2c2c2]">
								<span
									style={ {
										color: 'white',
										opacity: 0.6,
										fontSize: '13px',
									} }
								>
									{ __(
										'Select an image via the sidebar',
										'ytf'
									) }
								</span>
							</div>
						) }
					</div>

					{ /* Right — scrollable content panel (same classes as save.js) */ }
					<div
						className="w-full lg:w-1/2 flex items-start justify-center py-16 lg:py-24 min-h-screen"
						style={ { backgroundColor: rightBgColor } }
					>
						<div className="relative max-w-[600px] w-full px-8 md:px-12 lg:px-20">

							{ /* Collection list
							     Click a name to switch the editor preview — no state is saved */ }
							<div className="space-y-6 mb-20">
								{ collections.map( ( collection, index ) => {
									const isActive = index === activeIndex;
									const itemColor = isActive
										? activeColor
										: inactiveColor;
									return (
										<div
											key={ collection.id }
											className={ `collection-item${ isActive ? ' active' : '' }` }
											role="button"
											tabIndex={ 0 }
											aria-pressed={
												isActive ? 'true' : 'false'
											}
											onClick={ () =>
												setActiveIndex( index )
											}
											onKeyDown={ ( e ) => {
												if (
													e.key === 'Enter' ||
													e.key === ' '
												) {
													e.preventDefault();
													setActiveIndex( index );
												}
											} }
										>
											<div className="flex items-center gap-3 mb-1">
												<svg
													className="w-[15px] h-[15px] flex-shrink-0 collection-icon"
													viewBox="0 0 15 15"
													fill="none"
													aria-hidden="true"
												>
													<path
														d={ COLLECTION_SVG_PATH }
														fill={ itemColor }
													/>
												</svg>
												<h2
													className="font-ragna text-[36px] md:text-[40px] leading-[1.1] collection-title tracking-[2px]"
													style={ { color: itemColor } }
												>
													{ collection.name }
												</h2>
											</div>
											<p
												className="font-light text-[13px] md:text-[14px] leading-[1.5] collection-subtitle tracking-[1.4px] ml-[27px]"
												style={ { color: itemColor } }
											>
												{ collection.season }
											</p>
										</div>
									);
								} ) }
							</div>

							{ /* Season label */ }
							<div className="mb-10">
								<p
									className="font-light text-[13px] md:text-[14px] leading-[1.5] tracking-[1.4px]"
									style={ { color: textColor } }
								>
									{ activeCollection.season }
								</p>
							</div>

							{ /* Description paragraphs */ }
							<div className="mb-10">
								<div
									className="font-light text-[15px] md:text-[16px] leading-[1.6] tracking-[0.32px] space-y-6"
									style={ { color: textColor } }
								>
									<p>{ activeCollection.description1 }</p>
									<p>{ activeCollection.description2 }</p>
								</div>
							</div>

							{ /* CTA — same element and classes as save.js */ }
							<div>
								<a
									href={ activeCollection.buttonUrl || '#' }
									className="inline-block px-[40px] md:px-[45px] py-[14px] md:py-[15px] rounded-[5px] border font-normal text-[15px] md:text-[16px] leading-[1.3] tracking-[1.6px] banner-cta"
									style={ {
										borderColor: textColor,
										color: textColor,
										'--banner-text-color': textColor,
									} }
								>
									{ activeCollection.buttonText }
								</a>
							</div>

							{ /* Decorative watermark */ }
							{ decorativeImage && (
								<div className="absolute bottom-0 right-0 w-[180px] h-[186px] md:w-[220px] md:h-[227px] lg:w-[248px] lg:h-[256px] opacity-20 pointer-events-none">
									<img
										src={ decorativeImage }
										alt=""
										className="w-full h-full"
									/>
								</div>
							) }
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
