import { parse } from 'json2csv';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET() {
  try {
    await dbConnect();
    const companies = await Company.find({}).lean(); // Fetch companies from MongoDB

    const fields = [
      'name',
      'description',
      'facebook',
      'linkedin',
      'twitter',
      'instagram',
      'address',
      'phone',
      'email',
    ];
    const csv = parse(companies, { fields }); // Convert data to CSV format

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=companies.csv',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
