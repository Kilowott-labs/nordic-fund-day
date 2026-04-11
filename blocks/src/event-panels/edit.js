import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'agent-theme/treasure-mixer', {} ],
	[ 'agent-theme/investor-brunch', {} ],
];

const ALLOWED_BLOCKS = [
	'agent-theme/treasure-mixer',
	'agent-theme/investor-brunch',
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
