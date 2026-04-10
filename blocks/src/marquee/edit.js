import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
	TextControl,
	Button,
	ColorPicker,
	Flex,
	FlexItem,
} from '@wordpress/components';

// ─── Strip helpers ────────────────────────────────────────────────────────────

function makeStripUpdater( strips, setAttributes ) {
	return ( stripIndex, fields ) => {
		const updated = [ ...strips ];
		updated[ stripIndex ] = { ...updated[ stripIndex ], ...fields };
		setAttributes( { strips: updated } );
	};
}

function makeItemUpdater( strips, setAttributes ) {
	return ( stripIndex, itemIndex, text ) => {
		const updatedStrips = [ ...strips ];
		const updatedItems = [ ...updatedStrips[ stripIndex ].items ];
		updatedItems[ itemIndex ] = { ...updatedItems[ itemIndex ], text };
		updatedStrips[ stripIndex ] = {
			...updatedStrips[ stripIndex ],
			items: updatedItems,
		};
		setAttributes( { strips: updatedStrips } );
	};
}

function makeItemAdder( strips, setAttributes ) {
	return ( stripIndex ) => {
		const updatedStrips = [ ...strips ];
		const items = updatedStrips[ stripIndex ].items;
		const newId =
			items.length > 0
				? Math.max( ...items.map( ( i ) => i.id ) ) + 1
				: 1;
		updatedStrips[ stripIndex ] = {
			...updatedStrips[ stripIndex ],
			items: [
				...items,
				{ id: newId, text: __( 'New item', 'agent-theme' ) },
			],
		};
		setAttributes( { strips: updatedStrips } );
	};
}

function makeItemRemover( strips, setAttributes ) {
	return ( stripIndex, itemIndex ) => {
		const updatedStrips = [ ...strips ];
		const items = updatedStrips[ stripIndex ].items;
		if ( items.length <= 1 ) return;
		updatedStrips[ stripIndex ] = {
			...updatedStrips[ stripIndex ],
			items: items.filter( ( _, i ) => i !== itemIndex ),
		};
		setAttributes( { strips: updatedStrips } );
	};
}

// ─── Strip inspector panel ────────────────────────────────────────────────────

function StripPanel( { strip, stripIndex, label, updateStrip, updateItem, addItem, removeItem } ) {
	return (
		<PanelBody title={ label } initialOpen={ stripIndex === 0 }>

			{ /* Colors */ }
			<p style={ { fontWeight: 600, marginBottom: 4 } }>
				{ __( 'Background Color', 'agent-theme' ) }
			</p>
			<ColorPicker
				color={ strip.bgColor }
				onChange={ ( value ) => updateStrip( stripIndex, { bgColor: value } ) }
				enableAlpha={ false }
			/>

			<p style={ { fontWeight: 600, marginTop: 12, marginBottom: 4 } }>
				{ __( 'Text Color', 'agent-theme' ) }
			</p>
			<ColorPicker
				color={ strip.textColor }
				onChange={ ( value ) => updateStrip( stripIndex, { textColor: value } ) }
				enableAlpha={ false }
			/>

			{ /* Direction */ }
			<SelectControl
				label={ __( 'Direction', 'agent-theme' ) }
				value={ strip.direction }
				options={ [
					{ label: __( 'Left → Right', 'agent-theme' ), value: 'ltr' },
					{ label: __( 'Right → Left', 'agent-theme' ), value: 'rtl' },
				] }
				onChange={ ( value ) => updateStrip( stripIndex, { direction: value } ) }
			/>

			{ /* Font size */ }
			<RangeControl
				label={ __( 'Font Size (px)', 'agent-theme' ) }
				value={ strip.fontSize }
				onChange={ ( value ) => updateStrip( stripIndex, { fontSize: value } ) }
				min={ 12 }
				max={ 72 }
				step={ 1 }
			/>

			{ /* Item gap */ }
			<RangeControl
				label={ __( 'Item Spacing (px)', 'agent-theme' ) }
				value={ strip.gap }
				onChange={ ( value ) => updateStrip( stripIndex, { gap: value } ) }
				min={ 8 }
				max={ 160 }
				step={ 4 }
			/>

			{ /* Separator */ }
			<ToggleControl
				label={ __( 'Show Separator Dots', 'agent-theme' ) }
				checked={ strip.showSeparator }
				onChange={ ( value ) => updateStrip( stripIndex, { showSeparator: value } ) }
			/>
			{ strip.showSeparator && (
				<>
					<p style={ { fontWeight: 600, marginTop: 8, marginBottom: 4 } }>
						{ __( 'Separator Color', 'agent-theme' ) }
					</p>
					<ColorPicker
						color={ strip.separatorColor }
						onChange={ ( value ) => updateStrip( stripIndex, { separatorColor: value } ) }
						enableAlpha={ false }
					/>
				</>
			) }

			{ /* Items */ }
			<p style={ { fontWeight: 600, marginTop: 12, marginBottom: 8 } }>
				{ __( 'Items', 'agent-theme' ) }
			</p>
			{ strip.items.map( ( item, itemIndex ) => (
				<Flex key={ item.id } align="center" style={ { marginBottom: 6 } }>
					<FlexItem isBlock>
						<TextControl
							value={ item.text }
							onChange={ ( value ) =>
								updateItem( stripIndex, itemIndex, value )
							}
							placeholder={ __( 'Item text…', 'agent-theme' ) }
							hideLabelFromVision
							label={ `${ __( 'Item', 'agent-theme' ) } ${ itemIndex + 1 }` }
						/>
					</FlexItem>
					{ strip.items.length > 1 && (
						<FlexItem>
							<Button
								onClick={ () => removeItem( stripIndex, itemIndex ) }
								variant="tertiary"
								isDestructive
								size="small"
								aria-label={ __( 'Remove item', 'agent-theme' ) }
							>
								✕
							</Button>
						</FlexItem>
					) }
				</Flex>
			) ) }
			<Button
				onClick={ () => addItem( stripIndex ) }
				variant="secondary"
				style={ { width: '100%', marginTop: 4 } }
			>
				{ __( '+ Add Item', 'agent-theme' ) }
			</Button>
		</PanelBody>
	);
}

// ─── Canvas marquee strip ─────────────────────────────────────────────────────

function CanvasStrip( { strip } ) {
	const itemStyle = {
		color: strip.textColor,
		fontSize: `${ strip.fontSize }px`,
		fontWeight: 500,
		letterSpacing: '-0.02em',
		lineHeight: 1,
		marginRight: `${ strip.gap }px`,
		fontFamily: 'var(--wp--preset--font-family--dm-sans)',
	};

	const items = [ ...strip.items, ...strip.items ]; // duplicate for seamless loop

	return (
		<div
			className="w-full overflow-hidden py-[30px]"
			style={ {
				backgroundColor: strip.bgColor,
				'--marquee-separator-color': strip.separatorColor,
			} }
		>
			<div className="overflow-hidden w-full">
				<div
					className={ `marquee-track marquee-track--${ strip.direction }` }
				>
					{ items.map( ( item, idx ) => (
						<span
							key={ idx }
							className={ `marquee-item${ strip.showSeparator ? ' marquee-item--dot' : '' }` }
							style={ itemStyle }
						>
							{ item.text }
						</span>
					) ) }
				</div>
			</div>
		</div>
	);
}

// ─── Edit ─────────────────────────────────────────────────────────────────────

export default function Edit( { attributes, setAttributes } ) {
	const {
		layout,
		tilt,
		tiltAngle,
		sectionHeight,
		sectionHeightMobile,
		sectionBg,
		speed,
		pauseOnHover,
		strips,
	} = attributes;

	const updateStrip  = makeStripUpdater( strips, setAttributes );
	const updateItem   = makeItemUpdater( strips, setAttributes );
	const addItem      = makeItemAdder( strips, setAttributes );
	const removeItem   = makeItemRemover( strips, setAttributes );

	const visibleStrips = layout === 'single' ? strips.slice( 0, 1 ) : strips.slice( 0, 2 );

	const rootStyle = {
		'--marquee-speed': `${ speed }s`,
		'--tilt-angle': `${ tiltAngle }deg`,
		...( tilt ? {
			'--marquee-height-desktop': `${ sectionHeight }px`,
			'--marquee-height-mobile': `${ sectionHeightMobile }px`,
		} : {} ),
		...( sectionBg ? { backgroundColor: sectionBg } : {} ),
	};

	const blockProps = useBlockProps( {
		className: tilt
			? 'relative w-full overflow-hidden is-tilt'
			: 'w-full overflow-hidden',
		style: rootStyle,
		'data-pause-on-hover': String( pauseOnHover ),
	} );

	return (
		<>
			<InspectorControls>

				{ /* ── Layout & Tilt ── */ }
				<PanelBody title={ __( 'Layout & Tilt', 'agent-theme' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Number of Strips', 'agent-theme' ) }
						value={ layout }
						options={ [
							{ label: __( 'Single', 'agent-theme' ), value: 'single' },
							{ label: __( 'Double', 'agent-theme' ), value: 'double' },
						] }
						onChange={ ( value ) => setAttributes( { layout: value } ) }
					/>
					<ToggleControl
						label={ __( 'Enable Tilt', 'agent-theme' ) }
						help={ tilt
							? __( 'Strips overlap at an angle (double layout works best)', 'agent-theme' )
							: __( 'Strips stack flat horizontally', 'agent-theme' )
						}
						checked={ tilt }
						onChange={ ( value ) => setAttributes( { tilt: value } ) }
					/>
					{ tilt && (
						<>
							<RangeControl
								label={ __( 'Tilt Angle (deg)', 'agent-theme' ) }
								value={ tiltAngle }
								onChange={ ( value ) => setAttributes( { tiltAngle: value } ) }
								min={ 1 }
								max={ 15 }
								step={ 0.5 }
							/>
							<RangeControl
								label={ __( 'Desktop Height (px)', 'agent-theme' ) }
								value={ sectionHeight }
								onChange={ ( value ) => setAttributes( { sectionHeight: value } ) }
								min={ 200 }
								max={ 1000 }
								step={ 20 }
							/>
							<RangeControl
								label={ __( 'Mobile Height (px)', 'agent-theme' ) }
								value={ sectionHeightMobile }
								onChange={ ( value ) => setAttributes( { sectionHeightMobile: value } ) }
								min={ 100 }
								max={ 600 }
								step={ 10 }
							/>
						</>
					) }
					<p style={ { fontWeight: 600, marginTop: 12, marginBottom: 4 } }>
						{ __( 'Section Background', 'agent-theme' ) }
					</p>
					<ColorPicker
						color={ sectionBg }
						onChange={ ( value ) => setAttributes( { sectionBg: value } ) }
						enableAlpha={ false }
					/>
				</PanelBody>

				{ /* ── Playback ── */ }
				<PanelBody title={ __( 'Playback', 'agent-theme' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Speed (lower = faster)', 'agent-theme' ) }
						value={ speed }
						onChange={ ( value ) => setAttributes( { speed: value } ) }
						min={ 5 }
						max={ 80 }
						step={ 1 }
					/>
					<ToggleControl
						label={ __( 'Pause on Hover', 'agent-theme' ) }
						checked={ pauseOnHover }
						onChange={ ( value ) => setAttributes( { pauseOnHover: value } ) }
					/>
				</PanelBody>

				{ /* ── Per-strip panels ── */ }
				{ visibleStrips.map( ( strip, index ) => (
					<StripPanel
						key={ strip.id }
						strip={ strip }
						stripIndex={ index }
						label={ layout === 'single'
							? __( 'Strip', 'agent-theme' )
							: `${ __( 'Strip', 'agent-theme' ) } ${ index + 1 }`
						}
						updateStrip={ updateStrip }
						updateItem={ updateItem }
						addItem={ addItem }
						removeItem={ removeItem }
					/>
				) ) }

			</InspectorControls>

			{ /* ── Canvas ── */ }
			<section { ...blockProps }>
				{ visibleStrips.map( ( strip, index ) => {
					if ( tilt ) {
						const tiltSign  = index === 0 ? -1 : 1;
						const topOffset = index === 0 ? '40%' : '48%';
						return (
							<div
								key={ strip.id }
								className={ `marquee-strip marquee-strip--${ index + 1 }` }
								style={ {
									top: topOffset,
									transform: `rotate(${ tiltSign * tiltAngle }deg)`,
								} }
							>
								<CanvasStrip strip={ strip } />
							</div>
						);
					}
					return <CanvasStrip key={ strip.id } strip={ strip } />;
				} ) }
			</section>
		</>
	);
}
