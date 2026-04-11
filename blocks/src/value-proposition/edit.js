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
	const { subtitle, heading, bodyText, painPoints, imageLeft, imageLeftId, imageRight, imageRightId, quoteText } = attributes;

	const blockProps = useBlockProps( {
		className: 'relative bg-[var(--wp--preset--color--near-black)]',
	} );

	const updatePainPoint = ( index, text ) => {
		const updated = [ ...painPoints ];
		updated[ index ] = { ...updated[ index ], text };
		setAttributes( { painPoints: updated } );
	};

	const addPainPoint = () => {
		const newId = painPoints.length > 0 ? Math.max( ...painPoints.map( ( p ) => p.id ) ) + 1 : 1;
		setAttributes( { painPoints: [ ...painPoints, { id: newId, text: __( 'New pain point', 'agent-theme' ) } ] } );
	};

	const removePainPoint = ( index ) => {
		if ( painPoints.length <= 1 ) return;
		setAttributes( { painPoints: painPoints.filter( ( _, i ) => i !== index ) } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Images', 'agent-theme' ) } initialOpen={ true }>
					<p style={ { fontWeight: 600, marginBottom: '8px' } }>{ __( 'Left Image (Speaker)', 'agent-theme' ) }</p>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { imageLeft: media.url, imageLeftId: media.id } ) }
							allowedTypes={ [ 'image' ] }
							value={ imageLeftId }
							render={ ( { open } ) => (
								<>
									{ imageLeft && <img src={ imageLeft } alt="" style={ { width: '100%', height: 'auto', marginBottom: '8px', borderRadius: '4px' } } /> }
									<Button onClick={ open } variant="secondary" style={ { width: '100%' } }>
										{ imageLeft ? __( 'Change', 'agent-theme' ) : __( 'Upload', 'agent-theme' ) }
									</Button>
								</>
							) }
						/>
					</MediaUploadCheck>
					{ imageLeft && (
						<Button onClick={ () => setAttributes( { imageLeft: '', imageLeftId: 0 } ) } variant="link" isDestructive style={ { marginTop: '4px' } }>
							{ __( 'Remove', 'agent-theme' ) }
						</Button>
					) }

					<p style={ { fontWeight: 600, marginTop: '16px', marginBottom: '8px' } }>{ __( 'Right Image (Audience)', 'agent-theme' ) }</p>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { imageRight: media.url, imageRightId: media.id } ) }
							allowedTypes={ [ 'image' ] }
							value={ imageRightId }
							render={ ( { open } ) => (
								<>
									{ imageRight && <img src={ imageRight } alt="" style={ { width: '100%', height: 'auto', marginBottom: '8px', borderRadius: '4px' } } /> }
									<Button onClick={ open } variant="secondary" style={ { width: '100%' } }>
										{ imageRight ? __( 'Change', 'agent-theme' ) : __( 'Upload', 'agent-theme' ) }
									</Button>
								</>
							) }
						/>
					</MediaUploadCheck>
					{ imageRight && (
						<Button onClick={ () => setAttributes( { imageRight: '', imageRightId: 0 } ) } variant="link" isDestructive style={ { marginTop: '4px' } }>
							{ __( 'Remove', 'agent-theme' ) }
						</Button>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Quote', 'agent-theme' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Quote text', 'agent-theme' ) }
						value={ quoteText }
						onChange={ ( value ) => setAttributes( { quoteText: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Pain Points', 'agent-theme' ) } initialOpen={ false }>
					{ painPoints.map( ( point, idx ) => (
						<div key={ point.id } style={ { display: 'flex', gap: '4px', marginBottom: '6px' } }>
							<TextControl
								value={ point.text }
								onChange={ ( value ) => updatePainPoint( idx, value ) }
								style={ { flex: 1 } }
							/>
							{ painPoints.length > 1 && (
								<Button onClick={ () => removePainPoint( idx ) } icon="no-alt" isDestructive label={ __( 'Remove', 'agent-theme' ) } />
							) }
						</div>
					) ) }
					<Button onClick={ addPainPoint } variant="secondary" style={ { width: '100%' } }>
						{ __( '+ Add Pain Point', 'agent-theme' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="flex flex-col lg:flex-row justify-between">
					<div className="flex flex-col gap-16 sm:gap-20 lg:gap-[172px] px-4 sm:px-6 md:px-16 lg:pl-[90px] lg:pr-0 py-16 sm:py-20 lg:py-[132px] w-full lg:w-[42%] lg:max-w-[634px] flex-shrink-0">
						<div className="flex flex-col gap-4 sm:gap-6">
							<RichText
								tagName="span"
								value={ subtitle }
								onChange={ ( value ) => setAttributes( { subtitle: value } ) }
								className="font-mono text-[11px] sm:text-[14px] font-medium tracking-[0.11em] uppercase text-white"
								placeholder={ __( 'Subtitle…', 'agent-theme' ) }
							/>
							<RichText
								tagName="h2"
								value={ heading }
								onChange={ ( value ) => setAttributes( { heading: value } ) }
								className="text-[32px] sm:text-[44px] md:text-[52px] lg:text-[56px] xl:text-[64px] font-bold leading-[1] uppercase text-white"
								placeholder={ __( 'Heading…', 'agent-theme' ) }
							/>
						</div>
						<div className="flex flex-col gap-5 max-w-[532px]">
							<RichText
								tagName="p"
								value={ bodyText }
								onChange={ ( value ) => setAttributes( { bodyText: value } ) }
								className="text-white text-[15px] sm:text-lg leading-[1.6]"
								placeholder={ __( 'Body text…', 'agent-theme' ) }
							/>
							<div className="flex flex-col gap-3 sm:gap-4">
								{ painPoints.map( ( point ) => (
									<div key={ point.id } className="bg-white/10 border border-white/[0.18] rounded p-2.5">
										<div className="flex items-center gap-3">
											<span className="text-[var(--wp--preset--color--red-cross)] font-bold text-base w-[10px] flex-shrink-0">&#10007;</span>
											<span className="text-white/60 text-sm sm:text-base">{ point.text }</span>
										</div>
									</div>
								) ) }
							</div>
						</div>
					</div>

					<div className="relative w-full lg:w-[58%] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[779px] flex flex-row overflow-hidden self-start">
						<div className="relative w-[39%] flex-shrink-0 overflow-hidden bg-black/50">
							{ imageLeft ? (
								<img src={ imageLeft } alt="Presenter" className="w-full h-full object-cover object-center" />
							) : (
								<div className="w-full h-full flex items-center justify-center text-white/30 text-sm">Left Image</div>
							) }
						</div>
						<div className="relative flex-1 overflow-hidden bg-black/50">
							{ imageRight ? (
								<img src={ imageRight } alt="Audience" className="w-full h-full object-cover object-center" />
							) : (
								<div className="w-full h-full flex items-center justify-center text-white/30 text-sm">Right Image</div>
							) }
							<div className="absolute top-5 sm:top-7 right-4 sm:right-6 max-w-[85%] sm:max-w-[75%] lg:max-w-[334px] z-[2]">
								<div className="flex items-start gap-2 sm:gap-3">
									<span className="text-[var(--wp--preset--color--lime)] font-bold text-sm sm:text-base flex-shrink-0">&#10038;</span>
									<p className="text-white text-[12px] sm:text-[14px] lg:text-[16px] leading-[1.5]">{ quoteText }</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
