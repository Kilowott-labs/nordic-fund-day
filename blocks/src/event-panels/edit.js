import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'nordic-fund-day/treasure-mixer', {} ],
	[ 'nordic-fund-day/investor-brunch', {} ],
];

const ALLOWED_BLOCKS = [
	'nordic-fund-day/treasure-mixer',
	'nordic-fund-day/investor-brunch',
];

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'relative',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				template={ TEMPLATE }
				templateLock="all"
			/>
		</div>
	);
}
