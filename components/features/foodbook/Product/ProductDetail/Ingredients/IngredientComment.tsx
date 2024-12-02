'use client';

import {useTranslatedValue} from '@/app/hooks/useTranslatedValue';
import HtmlContent from '@/components/ui/HtmlContent';
import {Description} from '@/types';
import {FC, memo} from 'react';

type IngredientCommentProps = {
  ingredientcomment: Description;
};

const IngredientComment: FC<IngredientCommentProps> = memo(
  ({ingredientcomment}) => {
    const translatedComment = useTranslatedValue(ingredientcomment);

    if (!translatedComment) return null;

    return (
      <HtmlContent
        content={translatedComment}
        className="my-3 print:text-sm"
        tag="p"
      />
    );
  },
);

IngredientComment.displayName = 'IngredientComment';

export default IngredientComment;
