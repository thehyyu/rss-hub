
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ScrapedItem {
    title: string;
    link: string;
}

export default function NewFeedPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        itemSelector: 'article',
        titleSelector: 'h2',
        linkSelector: 'a',
    });
    const [previewItems, setPreviewItems] = useState<ScrapedItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePreview = async () => {
        setIsLoading(true);
        setError('');
        setPreviewItems([]);

        try {
            const res = await fetch('/api/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to preview');
            }

            const data = await res.json();
            setPreviewItems(data.items);
            if (data.items.length === 0) {
                setError('No items found with these selectors.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/feeds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to create feed');
            }

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/" className="text-slate-400 hover:text-white">&larr; Back</Link>
                <h2 className="text-2xl font-bold">Create New Feed</h2>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Feed Name</label>
                        <input
                            type="text"
                            placeholder="e.g. My Favorite Blog"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Target URL</label>
                        <input
                            type="url"
                            placeholder="https://example.com/blog"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-blue-300">Item Selector</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                value={formData.itemSelector}
                                onChange={(e) => setFormData({ ...formData, itemSelector: e.target.value })}
                            />
                            <p className="text-xs text-slate-500 mt-1">e.g. article, .post</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-green-300">Title Selector</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                value={formData.titleSelector}
                                onChange={(e) => setFormData({ ...formData, titleSelector: e.target.value })}
                            />
                            <p className="text-xs text-slate-500 mt-1">Relative to Item</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-purple-300">Link Selector</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                value={formData.linkSelector}
                                onChange={(e) => setFormData({ ...formData, linkSelector: e.target.value })}
                            />
                            <p className="text-xs text-slate-500 mt-1">Relative to Item</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-900/50 text-red-200 rounded border border-red-700/50 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 border-t border-slate-700 pt-6">
                    <button
                        type="button"
                        onClick={handlePreview}
                        disabled={isLoading || !formData.url}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white font-medium transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : 'Preview Selectors'}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !formData.name || !formData.url || previewItems.length === 0}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Feed
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            {previewItems.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Preview Results ({previewItems.length})</h3>
                    <div className="space-y-2">
                        {previewItems.map((item, i) => (
                            <div key={i} className="bg-slate-800/50 p-3 rounded border border-slate-700/50 text-sm">
                                <div className="font-semibold text-green-300 mb-1">{item.title}</div>
                                <div className="text-blue-300 truncate">{item.link}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
