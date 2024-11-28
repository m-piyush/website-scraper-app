'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AddUrl from '@/components/component/addUrl';
 
export default function CompanyPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        console.log("Fetching data for ID:", id); // Debug log
        const res = await fetch(`/api/company/${id}`);
        if (!res.ok) throw new Error("Failed to fetch company");
        const data = await res.json();
        setCompany(data.data);
      } catch (err) {
        console.error(err); // Log any error
        setError(err.message);
      }
    }
    fetchCompany();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  
  if (!company) return <div className='flex justify-center align-middle'>Loading...</div>;

 return (
    <>
      <AddUrl />
      <div className="bg-gray-100 ">
        {/* Breadcrumb */}
        <Breadcrumb className="bg-white p-2 w-full">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{String(company.name).charAt(0).toUpperCase() + String(company.name).slice(1)}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-14 bg-white p-6 rounded-md mt-2">
          <div className="">
            <Image src={company.logo} alt="logo" width={80} height={80} />

          </div>
          <div className='gap-2'>
            <h1 className="text-xl font-bold">
            {String(company.name).charAt(0).toUpperCase() + String(company.name).slice(1)}
              </h1>
            <p className=' text-gray-500 flex gap-2 items-center align-middle'> <img src="/description.svg" height={15} width={15} alt="fb" /> Description</p>
            <p className="text-base w-[300px] sm:w-[500]">{company.description}</p>
          </div>
          <div className="mt-4 sm:mt-0 text-sm text-gray-700">
            <p className="flex gap-1 font-medium">  <img src="/phone.svg" height={15} width={15} alt="fb" />  Phone: {company.phone}</p>
            <p className="flex gap-1 font-medium"> <img src="/email.svg" height={15} width={15} alt="fb" />  Email: {company.email}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          {/* Company Details */}
          <div className="bg-white p-6 shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-4">Company Details</h2>
            <ul className="space-y-2 text-sm ">
              <li>
                <span className="flex gap-2 text-base text-gray-500"> <img src="/website.svg"  height={15} width={15} alt="website" />
                  Website</span> {company.url}
              </li>
              <li>
                <span className="flex gap-2 text-base text-gray-500"> <img src="/description.svg"  height={15} width={15} alt="description" />Description</span> {company.description}
              </li>
              <li>
                <span className="flex gap-2 text-base text-gray-500"> <img src="/location.svg"  height={15} width={15} alt="location" /> Email</span> {company.email}
              </li>
              <li className='text-[#6C2BD9]'>
                <span className="flex gap-2 text-base text-gray-500"><img src="/fb.svg"  height={15} width={15} alt="fb" /> Facebook</span> {company.facebook}
              </li>
              <li className='text-[#6C2BD9]'>
                <span className="flex gap-2 text-base text-gray-500"><img src="/instagram.svg"  height={15} width={15} alt="instagram" /> Instagram</span> {company.instagram}
              </li>
              <li className='text-[#6C2BD9]'>
                <span className="flex gap-2 text-base text-gray-500"><img src="/x.svg"  height={15} width={15} alt="x" /> Twitter</span> {company.twitter}
              </li>
              <li className='text-[#6C2BD9]'>
                <span className="flex gap-2 text-base text-gray-500"><img src="/link.svg"  height={15} width={15} alt="website" /> LinkedIn</span> {company.linkedin}
              </li>
              <li>
                <span className="flex gap-2 text-base text-gray-500"><img src="/location.svg"  height={15} width={15} alt="location" /> Address</span> {company.address}
              </li>
            </ul>
          </div>

          {/* Screenshot Section */}
          <div className="bg-white p-6  rounded-md">
            <h2 className="flex gap-2 text-lg font-bold mb-4">
            <img src="/screenshot.svg"  height={20} width={20} alt="screenshot" /> 
              Screenshot of Webpage</h2>
            {company?.screenshot ? (
              <Image
                src={company?.screenshot} 
                alt="Screenshot"
                width={500}
                height={300}
                className="shadow-md"
              />
            ) : (
              <p className="text-sm text-gray-500">No screenshot available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
