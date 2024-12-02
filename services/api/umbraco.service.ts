import {apiHandler} from '@/lib/api/umbraco';
import {Culture, Umbraco, UmbracoForm, UmbracoItems} from '@/types';

export class UmbracoService {
  fetchMenuItems = async (locale: keyof typeof Culture): Promise<Umbraco[]> => {
    try {
      const result: UmbracoItems = await apiHandler('CONTENT.ROOT', {
        uFetch: 'children:home',
        locale,
        sort: 'sortOrder:asc',
      });

      // Show only menu items where umbracoNaviHide is false
      const items: Umbraco[] = result.items.filter(
        item => item.properties && item.properties.umbracoNavihide === false,
      );

      return items;
    } catch (error) {
      console.error('Error in fetchMenuItems:', error);
      throw error;
    }
  };

  fetchFooter = async (locale: keyof typeof Culture): Promise<any> => {
    try {
      const result: UmbracoItems = await apiHandler('CONTENT.HOME', {
        fields: '[footerLinks,footerBlocks,footerScripts]',
        locale,
      });

      return result;
    } catch (error) {
      console.error('Error in fetchFooter:', error);
      throw error;
    }
  };

  fetchAllPages = async (locale: keyof typeof Culture) => {
    try {
      const result: UmbracoItems = await apiHandler('CONTENT.ROOT', {
        locale,
      });

      return result;
    } catch (error) {
      console.error('Error in fetchAllPages:', error);
      throw error;
    }
  };

  fetchPageBySlug = async (
    slug: string,
    locale: keyof typeof Culture,
  ): Promise<any> => {
    try {
      const pathorid = Array.isArray(slug)
        ? slug.length > 1
          ? slug.join('/')
          : slug[0] || ''
        : slug || '';

      const result: UmbracoItems = await apiHandler(
        'CONTENT.ITEM',
        {
          locale,
        },
        {
          pathorid,
        },
      );

      return result;
    } catch (error) {
      console.error('Error in fetchPageBySlug:', error);
      return null;
    }
  };

  fetchChildrenBySlug = async (
    pathOrId: string,
    locale: keyof typeof Culture,
    take: number,
  ) => {
    try {
      const result: UmbracoItems = await apiHandler('CONTENT.ROOT', {
        uFetch: `children:${pathOrId}`,
        locale: locale,
        take: take,
        sort: 'sortOrder:asc',
      });

      return result;
    } catch (error) {
      console.error('Error in fetchChildrenBySlug:', error);
      throw error;
    }
  };

  fetchFormData = async (
    formid: string,
    locale: keyof typeof Culture,
  ): Promise<UmbracoForm> => {
    try {
      const result: UmbracoForm = await apiHandler(
        'FORM.FIELDS',
        {
          locale,
        },
        {formid, locale},
      );

      return result;
    } catch (error) {
      console.error('Error in fetchFormData:', error);
      throw error;
    }
  };

  postFormData = async (
    data: any,
    formid: string,
  ): Promise<{success: boolean; message: string; error?: any}> => {
    try {
      return await apiHandler(
        'FORM.SUBMIT',
        {formid},
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      );
    } catch (error) {
      console.error('Error in postFormData:', error);
      throw error;
    }
  };
}

export const umbracoService = new UmbracoService();
