
import * as cheerio from 'cheerio';

export interface ScrapedItem {
    title: string;
    link: string;
    content?: string;
}

export interface ScraperConfig {
    url: string;
    itemSelector: string;
    titleSelector: string;
    linkSelector: string;
}

export async function scrapeWebsite(config: ScraperConfig): Promise<ScrapedItem[]> {
    const { url, itemSelector, titleSelector, linkSelector } = config;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; RSS-Hub/1.0; +http://localhost)'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const items: ScrapedItem[] = [];

        $(itemSelector).each((_, element) => {
            const $element = $(element);

            // Extract title
            const title = $element.find(titleSelector).first().text().trim() ||
                $element.filter(titleSelector).text().trim();

            // Extract link
            let link = $element.find(linkSelector).first().attr('href') ||
                $element.filter(linkSelector).attr('href');

            // Resolve relative URLs
            if (link && !link.startsWith('http')) {
                try {
                    link = new URL(link, url).toString();
                } catch (e) {
                    // invalid url, ignore or keep as is
                    console.warn('Invalid URL found:', link);
                }
            }

            if (title && link) {
                items.push({ title, link });
            }
        });

        return items;
    } catch (error) {
        console.error('Scraping error:', error);
        throw error;
    }
}
