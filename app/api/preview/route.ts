
import { scrapeWebsite } from '@/lib/scraper';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, itemSelector, titleSelector, linkSelector } = body;

        if (!url || !itemSelector || !titleSelector || !linkSelector) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const items = await scrapeWebsite({
            url,
            itemSelector,
            titleSelector,
            linkSelector,
        });

        return NextResponse.json({ items });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Scraping failed' }, { status: 500 });
    }
}
