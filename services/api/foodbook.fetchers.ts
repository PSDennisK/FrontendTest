import {ProductClass} from '@/types';
import {getPsFoodbookTokenCookieName} from '@/utils/helpers';
import {cookies, headers} from 'next/headers';

export async function fetchProductBySlug(
  slug: string,
): Promise<ProductClass | null> {
  try {
    // Get token from cookies server-side
    const cookieStore = cookies();
    const cookieName = getPsFoodbookTokenCookieName();
    const token = cookieStore.get(cookieName);

    if (!token?.value) {
      console.error('No token found');
      return null;
    }

    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/product/${slug}`, {
      headers: {
        Cookie: `${cookieName}=${token.value}`,
      },
      next: {
        tags: ['product', slug],
        revalidate: 600, // Cache for 10 min.
      },
    });

    if (!response.ok) {
      console.error('Product fetch error:', response.status);
      return null;
    }

    const data = await response.json();
    return data as ProductClass;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
