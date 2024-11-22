import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function POST(req) {
  try {
    const { ids } = await req.json(); // Parse JSON body in the App Router

    await dbConnect();
    await Company.deleteMany({ _id: { $in: ids } });

    return new Response(
      JSON.stringify({ success: true, message: 'Companies deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
