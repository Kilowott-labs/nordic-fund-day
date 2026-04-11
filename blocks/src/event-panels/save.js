import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save( {
		className: 'relative overflow-hidden',
	} );

	return (
		<div { ...blockProps } data-event-panels="">
			<InnerBlocks.Content />
		</div>
	);
}
