import { isValidObjectId } from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET(req) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/'); // Split the path by slashes
  
  // The ID should be the last segment in the URL path
  const id = pathSegments[pathSegments.length - 1]; 
  console.log("id from URL path:", id);

  // Validate the ID
  if (!id || !isValidObjectId(id)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid or missing company ID' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    await dbConnect();
    const company = await Company.findById(id);

    if (!company) {
      return new Response(
        JSON.stringify({ success: false, message: 'Company not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: company }),
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
