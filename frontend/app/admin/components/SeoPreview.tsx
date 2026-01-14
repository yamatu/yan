'use client';

interface SeoPreviewProps {
    title: string;
    description: string;
    path: string;
    type: 'blog' | 'solution';
    metaTitle?: string;
    metaDescription?: string;
}

export default function SeoPreview({ title, description, path, type, metaTitle, metaDescription }: SeoPreviewProps) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kindanddivine.com';
    const fullUrl = `${baseUrl}/${type}/${path || 'your-url-slug'}`;

    // Use meta description if available, otherwise fallback to summary/description
    const contentDescription = metaDescription || description;

    // Truncate description for preview if too long (Google typically shows ~160 chars)
    const displayDescription = contentDescription.length > 160
        ? contentDescription.substring(0, 157) + '...'
        : contentDescription || 'Please provide a summary for your content. This will appear in search results.';

    // Use meta title if available, otherwise fallback to title
    const displayTitle = metaTitle || title || 'Your Page Title';

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Google Search Preview</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-100 max-w-2xl">
                <div className="flex items-center space-x-2 mb-1">
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">
                        <img src="/favicon.ico" alt="" className="w-4 h-4 opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-800 leading-tight">KindAndDivine</span>
                        <span className="text-xs text-gray-500 leading-tight">{fullUrl}</span>
                    </div>
                </div>
                <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate font-medium">
                    {displayTitle}
                </h3>
                <p className="text-sm text-[#4d5156] mt-1 leading-relaxed break-words">
                    {displayDescription}
                </p>
            </div>
            <p className="mt-3 text-xs text-gray-400">
                * This is a simulation of how your page might appear in Google search results. Actual display may vary.
            </p>
        </div>
    );
}
