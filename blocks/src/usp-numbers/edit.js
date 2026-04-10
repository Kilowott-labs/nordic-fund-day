import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	Button,
} from '@wordpress/components';

// Phone icon — exact SVG from Figma node 1:36
const PHONE_ICON = (
	<svg
		width="18"
		height="18"
		viewBox="0 0 18 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		className="shrink-0"
	>
		<path
			d="M2.23459 8.9524C1.45454 7.59223 1.07789 6.48157 0.850784 5.35573C0.514897 3.69065 1.28356 2.06412 2.55694 1.02627C3.09512 0.587632 3.71205 0.737497 4.0303 1.30844L4.74877 2.59739C5.31825 3.61905 5.60298 4.12988 5.54651 4.67146C5.49003 5.21304 5.10602 5.65413 4.33801 6.53631L2.23459 8.9524ZM2.23459 8.9524C3.81349 11.7055 6.29127 14.1846 9.04755 15.7654M9.04755 15.7654C10.4077 16.5454 11.5184 16.9221 12.6442 17.1492C14.3093 17.4851 15.9358 16.7164 16.9737 15.443C17.4123 14.9048 17.2625 14.2879 16.6915 13.9697L15.4026 13.2512C14.3809 12.6817 13.8701 12.397 13.3285 12.4534C12.7869 12.5099 12.3458 12.8939 11.4636 13.6619L9.04755 15.7654Z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
		<path
			d="M10.6458 4.74737C11.8169 5.24467 12.7554 6.18313 13.2527 7.35419M11.184 0.771629C14.0945 1.61153 16.3884 3.90536 17.2284 6.81576"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</svg>
);

// Gradient-stroke SVG number — auto-generated from item index
function UspNumber( { index } ) {
	const label = String( index + 1 ).padStart( 2, '0' );
	const gradId = `usp-grad-edit-${ index }`;

	return (
		<svg
			className="overflow-visible"
			width="128"
			height="50"
			viewBox="0 0 128 50"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id={ gradId } x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#F7EF33" />
					<stop offset="100%" stopColor="#43E508" />
				</linearGradient>
			</defs>
			<text
				x="0"
				y="46"
				fontSize="70"
				fontWeight="700"
				fill="none"
				stroke={ `url(#${ gradId })` }
				strokeWidth="1"
			>
				{ label }
			</text>
		</svg>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const { heading, headingColor, buttonText, buttonUrl, items } = attributes;

	const blockProps = useBlockProps( {
		className:
			'w-full bg-[var(--wp--preset--color--white)] rounded-[1.5rem] py-14 md:py-[5rem]',
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
					title: __( 'New Step', 'agent-theme' ),
					description: __(
						'Describe this step here.',
						'agent-theme'
					),
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
				{ /* Heading color */ }
				<PanelColorSettings
					title={ __( 'Heading Color', 'agent-theme' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: headingColor,
							onChange: ( value ) =>
								setAttributes( { headingColor: value } ),
							label: __( 'Text Color', 'agent-theme' ),
						},
					] }
				/>

				{ /* Heading & Button settings */ }
				<PanelBody
					title={ __( 'Heading & Button', 'agent-theme' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Button Text', 'agent-theme' ) }
						value={ buttonText }
						onChange={ ( value ) =>
							setAttributes( { buttonText: value } )
						}
					/>
					<TextControl
						label={ __( 'Button URL', 'agent-theme' ) }
						value={ buttonUrl }
						onChange={ ( value ) =>
							setAttributes( { buttonUrl: value } )
						}
					/>
				</PanelBody>

				{ /* USP items */ }
				<PanelBody
					title={ __( 'USP Items', 'agent-theme' ) }
					initialOpen={ true }
				>
					{ items.map( ( item, index ) => (
						<PanelBody
							key={ item.id }
							title={
								item.title ||
								`${ __( 'Step', 'agent-theme' ) } ${ index + 1 }`
							}
							initialOpen={ index === 0 }
						>
							<TextControl
								label={ __( 'Title', 'agent-theme' ) }
								value={ item.title }
								onChange={ ( value ) =>
									updateItem( index, { title: value } )
								}
							/>
							<TextareaControl
								label={ __( 'Description', 'agent-theme' ) }
								value={ item.description }
								onChange={ ( value ) =>
									updateItem( index, { description: value } )
								}
								rows={ 3 }
							/>
							{ items.length > 1 && (
								<Button
									onClick={ () => removeItem( index ) }
									variant="secondary"
									isDestructive
									style={ { marginTop: '8px' } }
								>
									{ __( 'Remove Step', 'agent-theme' ) }
								</Button>
							) }
						</PanelBody>
					) ) }
					<Button
						onClick={ addItem }
						variant="primary"
						style={ { width: '100%', marginTop: '8px' } }
					>
						{ __( '+ Add Step', 'agent-theme' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			{ /* Editor canvas — matches save.js structure */ }
			<section { ...blockProps }>
				<div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 flex flex-col lg:flex-row items-start lg:items-center xl:justify-center gap-10 lg:gap-16 xl:gap-[5.5rem]">

					{ /* Left: heading + CTA */ }
					<div className="flex flex-col gap-8 w-full lg:w-[13.9375rem] lg:shrink-0">
						<RichText
							tagName="h2"
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							className={ `text-[1.625rem] md:text-[1.875rem] font-bold leading-[1.15] md:leading-[2.125rem] tracking-[-0.04em] font-[family-name:var(--wp--preset--font-family--dm-sans)]${ ! headingColor ? ' text-[var(--wp--preset--color--near-black)]' : '' }` }
							style={ headingColor ? { color: headingColor } : undefined }
							placeholder={ __(
								'Enter heading…',
								'agent-theme'
							) }
						/>
						<div className="inline-flex items-center gap-3 px-5 py-[1.0625rem] rounded-[0.625rem] bg-[var(--wp--preset--color--lime)] text-[var(--wp--preset--color--near-black)] w-fit">
							{ PHONE_ICON }
							<span className="text-[1rem] font-medium leading-[1.75rem] tracking-[-0.02em] font-[family-name:var(--wp--preset--font-family--dm-sans)]">
								{ buttonText }
							</span>
						</div>
					</div>

					{ /* Right: USP items grid */ }
					<div className="flex flex-row flex-wrap gap-x-12 gap-y-10 xl:gap-x-14 xl:gap-y-12 items-start w-full lg:w-auto lg:flex-1 xl:flex-none">
						{ items.map( ( item, index ) => (
							<div
								key={ item.id }
								className="flex flex-col gap-6 w-full sm:w-[calc(50%-1.5rem)] xl:w-[15.75rem]"
							>
								<div className="flex flex-col">
									<UspNumber index={ index } />
									<div className="flex items-center pl-6 -mt-6">
										<h3 className="text-[1.5rem] font-bold leading-[2.125rem] tracking-[-0.02em] text-[var(--wp--preset--color--black)] font-[family-name:var(--wp--preset--font-family--dm-sans)]">
											{ item.title }
										</h3>
									</div>
								</div>
								<div className="pl-6">
									<p className="text-[0.9375rem] font-normal leading-[1.5rem] text-[var(--wp--preset--color--grey-mid)] font-[family-name:var(--wp--preset--font-family--dm-sans)]">
										{ item.description }
									</p>
								</div>
							</div>
						) ) }
					</div>

				</div>
			</section>
		</>
	);
}
