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
	SelectControl,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { backgroundImage, backgroundImageId, dateBadge, heading, description, buttons, stats, copyrightLeft, copyrightRight } = attributes;

	const blockProps = useBlockProps( {
		className: 'relative overflow-hidden bg-cover bg-center bg-no-repeat bg-white',
		style: backgroundImage ? { backgroundImage: `url(${ backgroundImage })` } : { backgroundColor: '#888' },
	} );

	const updateButton = ( index, fields ) => {
		const updated = [ ...buttons ];
		updated[ index ] = { ...updated[ index ], ...fields };
		setAttributes( { buttons: updated } );
	};

	const updateStat = ( index, text ) => {
		const updated = [ ...stats ];
		updated[ index ] = { ...updated[ index ], text };
		setAttributes( { stats: updated } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Background Image', 'agent-theme' ) } initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { backgroundImage: media.url, backgroundImageId: media.id } ) }
							allowedTypes={ [ 'image' ] }
							value={ backgroundImageId }
							render={ ( { open } ) => (
								<>
									{ backgroundImage && (
										<img
											src={ backgroundImage }
											alt=""
											style={ { width: '100%', height: 'auto', marginBottom: '8px', borderRadius: '4px' } }
										/>
									) }
									<Button onClick={ open } variant="secondary" style={ { width: '100%' } }>
										{ backgroundImage ? __( 'Change Image', 'agent-theme' ) : __( 'Upload Image', 'agent-theme' ) }
									</Button>
								</>
							) }
						/>
					</MediaUploadCheck>
					{ backgroundImage && (
						<Button
							onClick={ () => setAttributes( { backgroundImage: '', backgroundImageId: 0 } ) }
							variant="link"
							isDestructive
							style={ { marginTop: '4px' } }
						>
							{ __( 'Remove Image', 'agent-theme' ) }
						</Button>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Content', 'agent-theme' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Date Badge', 'agent-theme' ) }
						value={ dateBadge }
						onChange={ ( value ) => setAttributes( { dateBadge: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'CTA Buttons', 'agent-theme' ) } initialOpen={ false }>
					{ buttons.map( ( btn, idx ) => (
						<PanelBody key={ btn.id } title={ btn.label } initialOpen={ false }>
							<TextControl
								label={ __( 'Label', 'agent-theme' ) }
								value={ btn.label }
								onChange={ ( value ) => updateButton( idx, { label: value } ) }
							/>
							<TextControl
								label={ __( 'URL', 'agent-theme' ) }
								value={ btn.url }
								onChange={ ( value ) => updateButton( idx, { url: value } ) }
								type="url"
							/>
							<SelectControl
								label={ __( 'Style', 'agent-theme' ) }
								value={ btn.style }
								options={ [
									{ label: __( 'Primary (Green)', 'agent-theme' ), value: 'primary' },
									{ label: __( 'Ghost (Transparent)', 'agent-theme' ), value: 'ghost' },
								] }
								onChange={ ( value ) => updateButton( idx, { style: value } ) }
							/>
						</PanelBody>
					) ) }
				</PanelBody>

				<PanelBody title={ __( 'Stats', 'agent-theme' ) } initialOpen={ false }>
					{ stats.map( ( stat, idx ) => (
						<TextControl
							key={ stat.id }
							label={ `${ __( 'Stat', 'agent-theme' ) } ${ idx + 1 }` }
							value={ stat.text }
							onChange={ ( value ) => updateStat( idx, value ) }
						/>
					) ) }
				</PanelBody>

				<PanelBody title={ __( 'Copyright', 'agent-theme' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Left text', 'agent-theme' ) }
						value={ copyrightLeft }
						onChange={ ( value ) => setAttributes( { copyrightLeft: value } ) }
					/>
					<TextControl
						label={ __( 'Right text', 'agent-theme' ) }
						value={ copyrightRight }
						onChange={ ( value ) => setAttributes( { copyrightRight: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<footer { ...blockProps }>
				<div className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

				<div className="relative z-10 flex flex-col max-w-[861px] mx-auto pt-[80px] sm:pt-[100px] md:pt-[140px] px-4 sm:px-6">
					<div className="flex flex-col gap-2">
						<div className="inline-flex items-center px-3 sm:px-4 h-[32px] rounded-full bg-white border border-black/20 w-fit">
							<span className="text-black text-[11px] sm:text-[14px] font-bold tracking-[0.1em] sm:tracking-[0.32em] uppercase whitespace-nowrap">
								{ dateBadge }
							</span>
						</div>
						<RichText
							tagName="h2"
							value={ heading }
							onChange={ ( value ) => setAttributes( { heading: value } ) }
							className="text-black text-[56px] sm:text-[72px] md:text-[76px] lg:text-[80px] xl:text-[88px] min-[1600px]:text-[96px] font-black leading-[1] tracking-tight uppercase"
							placeholder={ __( 'Heading…', 'agent-theme' ) }
						/>
					</div>

					<RichText
						tagName="p"
						value={ description }
						onChange={ ( value ) => setAttributes( { description: value } ) }
						className="font-mono text-[16px] leading-[1.6] max-w-[483px] mt-2"
						style={ { color: '#373737' } }
						placeholder={ __( 'Description…', 'agent-theme' ) }
					/>

					<div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mt-[60px] sm:mt-[120px]">
						{ buttons.map( ( btn ) => (
							<div
								key={ btn.id }
								className={ `inline-flex items-center justify-center px-8 h-[48px] rounded-full font-bold text-[14px] sm:text-[16px] tracking-[0.07em] uppercase whitespace-nowrap ${
									btn.style === 'primary'
										? 'bg-[var(--wp--preset--color--lime)] border border-black/10 text-black'
										: 'bg-white/10 backdrop-blur-md border border-white/40 text-white'
								}` }
							>
								{ btn.label }
							</div>
						) ) }
					</div>

					<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4">
						{ stats.map( ( stat, idx ) => (
							<>
								{ idx > 0 && <span key={ `sep-${ stat.id }` } className="text-white/40 text-[10px]">•</span> }
								<span key={ stat.id } className="text-white text-[13px] font-semibold tracking-[0.1em] uppercase">{ stat.text }</span>
							</>
						) ) }
					</div>

					<div className="h-[100px] sm:h-[140px] md:h-[193px]"></div>
				</div>

				<div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 md:left-[90px] right-4 sm:right-6 md:right-[90px] flex flex-col sm:flex-row items-center sm:items-center justify-between gap-1 text-center sm:text-left">
					<span className="font-mono text-[10px] sm:text-[12px] font-medium" style={ { color: 'rgba(255,255,255,0.8)' } }>{ copyrightLeft }</span>
					<span className="font-mono text-[10px] sm:text-[12px] font-medium" style={ { color: 'rgba(255,255,255,0.8)' } }>{ copyrightRight }</span>
				</div>
			</footer>
		</>
	);
}
