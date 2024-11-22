import axios from 'axios';
import { load } from 'cheerio';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import puppeteer from 'puppeteer';

export async function POST(req) {
  const { url } = await req.json();
  console.log("url",url);
  
  try {
    if (!url) {
      return new Response(JSON.stringify({ success: false, message: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const domain = new URL(url).hostname; 

    const { data } = await axios.get(url);
    const $ = load(data);


    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], 
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' }); 


    const screenshotBuffer = await page.screenshot();

    const screenshotBase64 = screenshotBuffer.toString('base64');
    const screenshotUrl = `data:image/png;base64,${screenshotBase64}`; 

    let name = domain.split('.')[1] 
    let description = $('meta[name="description"]').attr('content') || '';
    let logo = $('link[rel="icon"]').attr('href') || '';
    let facebook = '';
    let linkedin = '';
    let twitter = '';
    let youtube = '';
    let instagram = '';
    let address = '';
    let phone = '';
    let email = '';


    // Extract JSON-LD structured data if available
    const jsonLdData = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        jsonLdData.push(JSON.parse($(el).html()));
      } catch (err) {
        console.error('Failed to parse JSON-LD:', err.message);
      }
    });

    // Find email using "mailto:"
    $('a[href^="mailto:"]').each((_, el) => {
      email = $(el).attr('href').replace('mailto:', '').trim();
    });

    // Find phone using "tel:"
    $('a[href^="tel:"]').each((_, el) => {
      phone = $(el).attr('href').replace('tel:', '').trim();
    });

    // Check social media links
    if ($('a[href^="https://www.facebook.com/"]')) {
      facebook = $('a[href^="https://www.facebook.com/"]').attr('href');
    }
    if ($('a[href^="https://www.linkedin.com/"]')) {
      linkedin = $('a[href^="https://www.linkedin.com/"]').attr('href');
    }
    if ($('a[href^="https://www.twitter.com/"]')) {
      twitter = $('a[href^="https://www.twitter.com/"]').attr('href');
    }
    if ($('a[href^="https://www.youtube.com/"]')) {
      youtube = $('a[href^="https://www.youtube.com/"]').attr('href');
    }
    if ($('a[href^="https://www.instagram.com/"]')) {
      instagram = $('a[href^="https://www.instagram.com/"]').attr('href');
    }

    // Parse JSON-LD for structured data to fill in missing fields
    jsonLdData.forEach((json) => {
      if (json['@type'] === 'Corporation' || json['@type'] === 'Organization') {
        name = json.name || name;
        description = json.description || description;
        logo = json.logo || logo;
        if (json.sameAs) {
          json.sameAs.forEach((url) => {
            if (url.includes('facebook.com') && !facebook) facebook = url;
            if (url.includes('linkedin.com') && !linkedin) linkedin = url;
            if (url.includes('twitter.com') && !twitter) twitter = url;
            if (url.includes('youtube.com') && !youtube) youtube = url;
            if (url.includes('instagram.com') && !instagram) instagram = url;
          });
        }
        if (json.address) {
          const addr = json.address;
          address = `${addr.streetAddress || ''}, ${addr.addressLocality || ''}, ${addr.addressCountry || ''}`;
        }
      }
    });

    // Save to MongoDB
    await dbConnect();

    const company = new Company({
      url,
      screenshot: screenshotUrl,  
      name,
      description,
      logo,
      facebook,
      linkedin,
      twitter,
      youtube,
      instagram,
      address,
      phone,
      email,
    });

    console.log('Company data to save:', company);

    
    await company.save();
    await browser.close(); 

    return new Response(JSON.stringify({ success: true, data: company }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error scraping:', error.message);
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
