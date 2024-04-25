import React from 'react';
import { View, Linking } from 'react-native';
import { parseDocument, ElementType } from 'htmlparser2';
import { Text } from './ui/text';

interface HtmlNode {
    type: ElementType.ElementType;
    name?: string;
    data?: string;
    attributes?: { [key: string]: string };
    children?: HtmlNode[];
}

const textTags = ['span', 'strong', 'em'];

const renderTextNode = (textNode: HtmlNode, index: number): React.ReactElement => (
    <Text key={index}>{textNode.data}</Text>
);

const renderElement = (element: HtmlNode, index: number): React.ReactElement => {
    const Wrapper = textTags.includes(element.name!) ? Text : View;

    if (element.name === 'a' && element.attributes) {
        const href = element.attributes.href;
        return (
            <Wrapper className='w-full' key={index} onPress={() => Linking.openURL(href)}>
                {element.children?.map((c, i) => renderNode(c, i))}
            </Wrapper>
        );
    }

    return (
        <Wrapper className='w-full' key={index}>
            {element.children?.map((c, i) => renderNode(c, i))}
        </Wrapper>
    );
};

const renderNode = (node: HtmlNode, index: number): React.ReactElement | null => {
    switch (node.type) {
        case ElementType.Text:
            return renderTextNode(node, index);
        case ElementType.Tag:
            return renderElement(node, index);
        default:
            return null;
    }
};

const RenderHtml: React.FC<{ html: string }> = ({ html }) => {
    const document = parseDocument(html);
    return document.children?.map((c, i) => renderNode(c as unknown as HtmlNode, i)) ?? null;
};

export default RenderHtml;
