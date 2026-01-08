
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const feeds = await prisma.feed.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-300">Your Feeds</h2>
      </div>

      {feeds.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-slate-400 mb-4">No feeds configured yet.</p>
          <Link href="/new" className="text-blue-400 hover:underline">
            Create your first feed &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {feeds.map((feed) => (
            <div key={feed.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
              <h3 className="font-bold text-lg mb-1">{feed.name}</h3>
              <p className="text-sm text-slate-400 mb-4 truncate">{feed.url}</p>

              <div className="flex items-center gap-2 bg-slate-900 p-3 rounded-lg overflow-hidden">
                <code className="text-xs text-blue-300 flex-1 truncate">
                  {`/api/rss/${feed.id}`}
                </code>
                {/* We'll use a client component for copy functionality if valid, 
                    but for now a simple link is good enough */}
                <a
                  href={`/api/rss/${feed.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white"
                >
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
