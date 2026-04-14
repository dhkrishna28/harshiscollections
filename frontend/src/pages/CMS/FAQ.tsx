import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { cmsService } from '../../services/cmsService';

export default function FAQ() {
  const { data } = useQuery({ queryKey: ['cms', 'faq'], queryFn: () => cmsService.getPage('faq') });
  const page = data?.data;
  return (
    <>
  <Helmet><title>{page?.meta_title || 'FAQ'} – Harshis Collections</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{page?.title || 'Frequently Asked Questions'}</h1>
        {page?.content ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
        ) : (
          <p className="text-gray-500">Content coming soon.</p>
        )}
      </div>
    </>
  );
}
