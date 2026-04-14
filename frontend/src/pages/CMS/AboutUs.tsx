import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '../../services/cmsService';

export default function AboutUs() {
  const { data } = useQuery({ queryKey: ['cms', 'about_us'], queryFn: () => cmsService.getPage('about_us') });
  const page = data?.data;
  return (
    <>
      <Helmet>
  <title>{page?.meta_title || 'About Us'} – Harshis Collections</title>
        {page?.meta_description && <meta name="description" content={page.meta_description} />}
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{page?.title || 'About Us'}</h1>
        {page?.content ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
        ) : (
          <p className="text-gray-500">Content coming soon.</p>
        )}
      </div>
    </>
  );
}
