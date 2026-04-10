import { useBlockProps } from '@wordpress/block-editor';

// The decorative SVG path shared by all collection items
const COLLECTION_SVG_PATH =
	'M14.9102 0H14.8429C14.7559 0.00841751 14.6689 0.0476992 14.5819 0.115039C14.523 0.154321 14.4753 0.199214 14.4388 0.249719C14.0236 0.664983 13.6308 1.04938 13.2576 1.40292C12.4158 2.17733 11.5264 2.90685 10.5808 3.58586C9.66049 4.26768 8.63636 4.65208 7.50842 4.73345C6.17284 4.68014 4.59035 3.88328 2.76094 2.33726C2.17172 1.83221 1.59933 1.30191 1.04377 0.743547C1.00449 0.704265 0.965208 0.664983 0.928732 0.625701C0.810887 0.505051 0.693042 0.3844 0.578002 0.263749C0.572391 0.258137 0.569585 0.255331 0.563973 0.249719C0.527497 0.199214 0.476992 0.157127 0.420875 0.115039C0.333895 0.0476992 0.246914 0.0112233 0.159933 0H0.0925926C0.03367 0 0.00280584 0.0308642 0.00280584 0.0897868V0.157127C0.016835 0.291807 0.10101 0.426487 0.249719 0.563973C1.5881 1.90236 2.63187 3.08361 3.38384 4.10494C4.27609 5.32548 4.72783 6.45623 4.73625 7.5C4.72783 8.54377 4.27609 9.67452 3.38384 10.8951C2.63187 11.9164 1.5853 13.0976 0.249719 14.436C0.0982043 14.5707 0.016835 14.7054 0.00280584 14.8429V14.9102C0.00280584 14.9691 0.03367 15 0.0925926 15H0.159933C0.246914 14.9916 0.333895 14.9523 0.420875 14.885C0.479798 14.8457 0.527497 14.8008 0.563973 14.7531C0.569585 14.7475 0.572391 14.7447 0.578002 14.7391C0.695847 14.6156 0.810887 14.495 0.928732 14.3771C0.968013 14.3378 1.0073 14.2985 1.04377 14.2593C1.59933 13.7009 2.17172 13.1706 2.76094 12.6655C4.59035 11.1195 6.17284 10.3227 7.50842 10.2694C8.63356 10.3507 9.65769 10.7323 10.5808 11.4169C11.5236 12.096 12.4158 12.8255 13.2576 13.5999C13.6308 13.9534 14.0236 14.3378 14.4388 14.7531C14.4753 14.8036 14.5258 14.8485 14.5819 14.8878C14.6689 14.9523 14.7559 14.9916 14.8429 15.0028H14.9102C14.9691 15.0028 15 14.9719 15 14.913V14.8457C14.986 14.711 14.9018 14.5763 14.7531 14.4388C13.4007 13.1004 12.3541 11.9136 11.619 10.8754C10.7379 9.67172 10.289 8.54938 10.2666 7.50281C10.289 6.45623 10.7379 5.33389 11.619 4.13019C12.3569 3.09203 13.4007 1.90516 14.7531 0.566779C14.9046 0.432099 14.986 0.294613 15 0.159933V0.0925926C15 0.03367 14.9691 0.00280584 14.9102 0.00280584V0Z';

export default function save( { attributes } ) {
	const {
		collections,
		rightBgColor,
		activeColor,
		inactiveColor,
		textColor,
		decorativeImage,
	} = attributes;

	const blockProps = useBlockProps.save();

	const first = collections[ 0 ] || {};

	return (
		<div { ...blockProps } data-banner-text="">
			<div className="relative w-full flex flex-col lg:flex-row">

				{ /* ── Left — sticky image panel ──────────────────────────────── */ }
				<div className="w-full lg:w-1/2 h-[60vh] lg:h-screen bg-[#c2c2c2] lg:sticky lg:top-0">
					<img
						src={ first.image || '' }
						alt={ first.name || '' }
						className="w-full h-full object-cover fade-transition"
						data-banner-image=""
						loading="lazy"
					/>
				</div>

				{ /* ── Right — scrollable content panel ───────────────────────── */ }
				<div
					className="w-full lg:w-1/2 flex items-start justify-center py-16 lg:py-24 min-h-screen"
					style={ { backgroundColor: rightBgColor } }
				>
					<div className="relative max-w-[600px] w-full px-8 md:px-12 lg:px-20">

						{ /* Collection list */ }
						<div className="space-y-6 mb-20">
							{ collections.map( ( collection, index ) => {
								const isFirst = index === 0;
								const itemColor = isFirst
									? activeColor
									: inactiveColor;
								return (
									<div
										key={ collection.id }
										className={ `collection-item${ isFirst ? ' active' : '' }` }
										data-collection={ String(
											collection.id
										) }
										data-image={ collection.image || '' }
										data-season={ collection.season }
										data-desc1={ collection.description1 }
										data-desc2={ collection.description2 }
										data-button={ collection.buttonText }
										data-button-url={
											collection.buttonUrl || '#'
										}
										data-active-color={ activeColor }
										data-inactive-color={ inactiveColor }
										tabIndex={ 0 }
										role="button"
										aria-pressed={
											isFirst ? 'true' : 'false'
										}
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

						{ /* Season label — updated by view.js on collection switch */ }
						<div className="mb-10">
							<p
								className="font-light text-[13px] md:text-[14px] leading-[1.5] tracking-[1.4px]"
								style={ { color: textColor } }
								data-banner-season-label=""
							>
								{ first.season }
							</p>
						</div>

						{ /* Description paragraphs */ }
						<div className="mb-10">
							<div
								className="font-light text-[15px] md:text-[16px] leading-[1.6] tracking-[0.32px] space-y-6"
								style={ { color: textColor } }
							>
								<p data-banner-desc1="">
									{ first.description1 }
								</p>
								<p data-banner-desc2="">
									{ first.description2 }
								</p>
							</div>
						</div>

						{ /* CTA link
						     CSS custom property enables hover colour via .banner-cta in tailwind.css */ }
						<div>
							<a
								href={ first.buttonUrl || '#' }
								className="inline-block px-[40px] md:px-[45px] py-[14px] md:py-[15px] rounded-[5px] border font-normal text-[15px] md:text-[16px] leading-[1.3] tracking-[1.6px] banner-cta"
								style={ {
									borderColor: textColor,
									color: textColor,
									'--banner-text-color': textColor,
								} }
								data-banner-cta=""
							>
								{ first.buttonText }
							</a>
						</div>

						{ /* Decorative watermark */ }
						{ decorativeImage && (
							<div className="absolute bottom-0 right-0 w-[180px] h-[186px] md:w-[220px] md:h-[227px] lg:w-[248px] lg:h-[256px] opacity-20 pointer-events-none">
								<img
									src={ decorativeImage }
									alt=""
									className="w-full h-full"
									loading="lazy"
								/>
							</div>
						) }
					</div>
				</div>
			</div>
		</div>
	);
}
