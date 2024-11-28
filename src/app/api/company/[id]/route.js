import { isValidObjectId } from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const company = await Company.findById(id);
    if (!company) {
      return new Response(JSON.stringify({ success: false, message: 'Company not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true, data: company }), {
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
