import {toHtmlEntities} from '@/utils/helpers';
import React, {ElementType} from 'react';

interface HtmlContentProps {
  content: string;
  className?: string;
  tag?: ElementType;
  encodeEntities?: boolean;
}

const HtmlContent: React.FC<HtmlContentProps> = ({
  content,
  className = '',
  tag: Tag = 'div',
  encodeEntities = true,
}) => {
  const htmlContent = encodeEntities ? toHtmlEntities(content) : content;

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{__html: htmlContent}}
    />
  );
};

export default React.memo(HtmlContent);
