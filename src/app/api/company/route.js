import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET() {
  try {
    await dbConnect();
    const companies = await Company.find({});
    return new Response(JSON.stringify({ success: true, data: companies }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
