import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    RichText,
    MediaUpload,
    MediaUploadCheck,
    ColorPalette,
    __experimentalLinkControl as LinkControl
} from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, BaseControl, ToggleControl, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
    const { subtitle, heading, buttonText, buttonUrl, buttonOpenInNewTab, backgroundColor, cards } = attributes;
    const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(false);

    const blockProps = useBlockProps({
        className: 'relative w-full flex flex-col gap-[30px] py-16 lg:py-20',
        style: {
            backgroundColor: backgroundColor || 'black'
        }
    });

    const themeColors = [
        { name: 'Black', color: '#000000' },
        { name: 'Testimonial BG', color: '#1a1b1e' },
        { name: 'Teal', color: '#2f6f6a' },
        { name: 'Grey Dark', color: '#2b2b2b' },
        { name: 'Near Black', color: '#141414' },
        { name: 'White', color: '#ffffff' }
    ];

    const updateCard = (index, field, value) => {
        const updated = [...cards];
        updated[index] = { ...updated[index], [field]: value };
        setAttributes({ cards: updated });
    };

    const addCard = () => {
        const newId = Math.max(...cards.map(c => c.id), 0) + 1;
        setAttributes({ cards: [...cards, { id: newId, text: 'New Achievement', icon: '', iconId: 0 }] });
    };

    const removeCard = (index) => {
        if (cards.length <= 1) return;
        setAttributes({ cards: cards.filter((_, i) => i !== index) });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Settings', 'agent-theme')} initialOpen={true}>
                    <TextControl
                        label={__('Subtitle', 'agent-theme')}
                        value={subtitle}
                        onChange={(value) => setAttributes({ subtitle: value })}
                    />
                </PanelBody>
                <PanelBody title={__('Button Settings', 'agent-theme')} initialOpen={false}>
                    <TextControl
                        label={__('Button Text', 'agent-theme')}
                        value={buttonText}
                        onChange={(value) => setAttributes({ buttonText: value })}
                    />
                    <BaseControl 
                        label={__('Button Link', 'agent-theme')}
                        help={__('Click the button below to set or change the link', 'agent-theme')}
                    >
                        <div style={{ marginTop: '8px' }}>
                            <Button
                                variant="secondary"
                                onClick={() => setIsLinkPickerVisible(!isLinkPickerVisible)}
                            >
                                {buttonUrl ? __('Edit Link', 'agent-theme') : __('Set Link', 'agent-theme')}
                            </Button>
                            {buttonUrl && (
                                <div style={{ marginTop: '8px', padding: '8px', background: '#f0f0f0', borderRadius: '4px', fontSize: '12px' }}>
                                    <strong>{__('Current URL:', 'agent-theme')}</strong> {buttonUrl}
                                    {buttonOpenInNewTab && <span style={{ marginLeft: '8px', color: '#666' }}>({__('Opens in new tab', 'agent-theme')})</span>}
                                </div>
                            )}
                            {isLinkPickerVisible && (
                                <Popover
                                    position="bottom left"
                                    onClose={() => setIsLinkPickerVisible(false)}
                                >
                                    <div style={{ padding: '16px', minWidth: '360px' }}>
                                        <LinkControl
                                            searchInputPlaceholder={__('Search or enter URL', 'agent-theme')}
                                            value={{
                                                url: buttonUrl,
                                                opensInNewTab: buttonOpenInNewTab
                                            }}
                                            onChange={(newLink) => {
                                                setAttributes({
                                                    buttonUrl: newLink?.url || '',
                                                    buttonOpenInNewTab: newLink?.opensInNewTab || false
                                                });
                                            }}
                                            settings={[
                                                {
                                                    id: 'opensInNewTab',
                                                    title: __('Open in new tab', 'agent-theme')
                                                }
                                            ]}
                                            showSuggestions={true}
                                        />
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                            {buttonUrl && (
                                                <Button
                                                    variant="secondary"
                                                    isDestructive
                                                    onClick={() => {
                                                        setAttributes({
                                                            buttonUrl: '',
                                                            buttonOpenInNewTab: false
                                                        });
                                                        setIsLinkPickerVisible(false);
                                                    }}
                                                >
                                                    {__('Remove Link', 'agent-theme')}
                                                </Button>
                                            )}
                                            <Button
                                                variant="primary"
                                                onClick={() => setIsLinkPickerVisible(false)}
                                            >
                                                {__('Done', 'agent-theme')}
                                            </Button>
                                        </div>
                                    </div>
                                </Popover>
                            )}
                        </div>
                    </BaseControl>
                </PanelBody>
                <PanelBody title={__('Background Color', 'agent-theme')} initialOpen={false}>
                    <BaseControl label={__('Select Background Color', 'agent-theme')}>
                        <ColorPalette
                            colors={themeColors}
                            value={backgroundColor}
                            onChange={(color) => setAttributes({ backgroundColor: color || 'black' })}
                        />
                    </BaseControl>
                </PanelBody>
                <PanelBody title={__('Achievement Cards', 'agent-theme')} initialOpen={true}>
                    {cards.map((card, index) => (
                        <PanelBody key={card.id} title={`Card ${index + 1}`} initialOpen={false}>
                            <TextControl
                                label={__('Card Text', 'agent-theme')}
                                value={card.text}
                                onChange={(value) => updateCard(index, 'text', value)}
                                help={__('Use \\n for line breaks', 'agent-theme')}
                            />
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => {
                                        console.log('Icon selected:', media.url, 'for card index:', index);
                                        const updated = [...cards];
                                        updated[index] = { 
                                            ...updated[index], 
                                            icon: media.url,
                                            iconId: media.id 
                                        };
                                        setAttributes({ cards: updated });
                                    }}
                                    allowedTypes={['image']}
                                    value={card.iconId || 0}
                                    render={({ open }) => (
                                        <>
                                            <Button onClick={open} variant="secondary" style={{ marginTop: '8px' }}>
                                                {card.icon ? __('Change Icon', 'agent-theme') : __('Select Icon', 'agent-theme')}
                                            </Button>
                                            {card.icon && (
                                                <>
                                                    <div style={{ marginTop: '8px', padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                                                        <img src={card.icon} alt="" style={{ maxWidth: '100px', height: 'auto', display: 'block' }} />
                                                    </div>
                                                    <Button 
                                                        onClick={() => {
                                                            const updated = [...cards];
                                                            updated[index] = { 
                                                                ...updated[index], 
                                                                icon: '',
                                                                iconId: 0 
                                                            };
                                                            setAttributes({ cards: updated });
                                                        }} 
                                                        variant="secondary" 
                                                        isDestructive
                                                        style={{ marginTop: '8px' }}
                                                    >
                                                        {__('Remove Icon', 'agent-theme')}
                                                    </Button>
                                                </>
                                            )}
                                        </>
                                    )}
                                />
                            </MediaUploadCheck>
                            {cards.length > 1 && (
                                <Button onClick={() => removeCard(index)} variant="secondary" isDestructive style={{ marginTop: '12px' }}>
                                    {__('Remove Card', 'agent-theme')}
                                </Button>
                            )}
                        </PanelBody>
                    ))}
                    <Button onClick={addCard} variant="primary" style={{ marginTop: '8px' }}>
                        {__('Add Card', 'agent-theme')}
                    </Button>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="max-w-[1580px] mx-auto px-4 md:px-6 lg:px-8 w-full">
                    <div className="relative w-full bg-[var(--wp--preset--color--testimonial-bg)] rounded-[20px] p-8 md:p-16 lg:p-[110px_100px] flex flex-col gap-[30px]">
                        
                        {/* Decorative Box */}
                        <span className="hidden lg:block absolute top-0 left-0 w-[400px] h-[100px] bg-black rounded-br-[20px]"></span>
                        
                        {/* Top Row */}
                        <div className="relative z-10 flex flex-col lg:flex-row gap-[30px]">
                            <div className="w-full lg:w-1/2"></div>
                            
                            <div className="w-full lg:w-1/2 flex flex-col gap-8">
                                <RichText
                                    tagName="span"
                                    className="pre-circle text-white text-[17px] leading-[17px] inline-block"
                                    value={subtitle}
                                    onChange={(value) => setAttributes({ subtitle: value })}
                                    placeholder={__('Enter subtitle...', 'agent-theme')}
                                />
                                
                                <RichText
                                    tagName="h2"
                                    className="text-white text-[32px] md:text-[38px] lg:text-[44px] font-semibold leading-[1.1] tracking-[-0.02em]"
                                    value={heading}
                                    onChange={(value) => setAttributes({ heading: value })}
                                    placeholder={__('Enter heading...', 'agent-theme')}
                                />
                                
                                <div>
                                    <a 
                                        href={buttonUrl} 
                                        className="btn-hover-effect inline-flex items-center gap-0 group"
                                        target={buttonOpenInNewTab ? '_blank' : '_self'}
                                        rel={buttonOpenInNewTab ? 'noopener noreferrer' : undefined}
                                    >
                                        <span className="btn-text inline-block px-[22px] py-[7px] bg-[var(--wp--preset--color--cta-button)] text-[var(--wp--preset--color--cta-text)] text-[16px] font-medium leading-[26px] rounded-full transition-all">
                                            {buttonText}
                                        </span>
                                        <span className="btn-circle inline-flex items-center justify-center w-[36px] h-[36px] bg-[var(--wp--preset--color--cta-button)] text-[var(--wp--preset--color--cta-text)] rounded-full -ml-1 transition-all">
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Cards Row */}
                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
                            {cards.map((card) => (
                                <div key={card.id} className="card-hover bg-[var(--wp--preset--color--card-bg)] border border-[rgba(255,255,255,0.1)] rounded-[20px] p-[45px] text-center">
                                    <div className="flex flex-col items-center gap-6">
                                        {card.icon ? (
                                            <div className="icon-white w-[66px] h-[30px] flex items-center justify-center">
                                                <img src={card.icon} alt="" style={{ maxWidth: '66px', maxHeight: '30px', width: 'auto', height: 'auto' }} />
                                            </div>
                                        ) : (
                                            <div className="icon-white w-[66px] h-[30px]">
                                                <svg width="66" height="30" viewBox="0 0 66 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M42.7972 5.02187C40.2416 7.11036 37.4561 8.80888 34.5009 10.0714C32.9108 7.10932 30.9115 4.31207 28.5472 1.7315C29.9435 1.26425 31.4331 1 32.9861 1C36.8082 1 40.2713 2.53686 42.7972 5.02187ZM33.3759 12.9952C33.7587 13.8086 34.1047 14.6392 34.4304 15.4767C29.7155 17.0387 25.5933 20.2878 23.0215 24.8295C20.5435 22.3168 19.0084 18.8731 18.9902 15.0675C24.0228 15.3475 28.8888 14.6017 33.3759 12.9952ZM35.5416 12.1427C35.9565 13.0338 36.3274 13.9396 36.6759 14.852C40.0893 14.1373 43.6287 14.3081 46.9575 15.3483C46.9593 15.3013 46.9625 15.2545 46.9658 15.2077C46.9707 15.1371 46.9757 15.0664 46.9757 14.9945C46.9757 11.9274 45.9779 9.09834 44.3049 6.79115C41.6563 8.96287 38.7137 10.7745 35.5416 12.1427ZM39.3219 27.4736C39.1421 23.9589 38.5337 20.4644 37.461 17.0799C40.5383 16.4853 43.709 16.7005 46.7163 17.7225C45.8738 21.9922 43.0894 25.5559 39.3219 27.4736ZM32.3119 10.9092C30.6925 7.95486 28.6644 5.20767 26.2805 2.71287C24.4142 3.73569 22.8057 5.17087 21.5772 6.90919C20.3487 8.64757 19.5327 10.6433 19.1912 12.7446C23.7071 12.9872 28.1459 12.3572 32.3119 10.9092ZM33.9064 18.1426C34.3356 17.9648 34.773 17.8185 35.2103 17.675C36.3085 21.1078 36.9074 24.7129 37.0201 28.4029C35.7108 28.7986 34.3505 28.9998 32.9828 29C29.9367 29 27.1271 28.0158 24.8289 26.3624C26.8035 22.6552 29.9742 19.7715 33.9064 18.1426Z" fill="white"/>
                                                </svg>
                                            </div>
                                        )}
                                        <p className="text-white text-[16px] font-medium leading-[1.5] tracking-[-0.02em] m-0" style={{ whiteSpace: 'pre-line' }}>
                                            {card.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
