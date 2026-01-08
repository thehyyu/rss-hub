
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const feeds = await prisma.feed.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(feeds);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, url, itemSelector, titleSelector, linkSelector } = body;

        const feed = await prisma.feed.create({
            data: {
                name,
                url,
                itemSelector,
                titleSelector,
                linkSelector,
            },
        });

        return NextResponse.json(feed);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create feed' }, { status: 500 });
    }
}
