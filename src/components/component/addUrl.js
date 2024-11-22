'use client';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState } from 'react';
import axios from 'axios';

export default function AddUrl({ onScrapeSuccess }) {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleScrape = async () => {

    try {

      const res = await axios.post('/api/scrape', { url });
      setMessage(`Company "${res.data.data.name}" added successfully!`);
      setUrl('');
      onScrapeSuccess(); 
    } catch (error) {
      setMessage('Error scraping website.');
    }
  };

  return (
    <>
      <div className="bg-white flex items-center">
        <div className="sm:w-1/2 w-full block sm:flex  gap-[8px] my-5 mx-2">
          <div className="relative w-full mb-4 sm:mb-0 ">
            <img
              src="/search.svg"
              alt="Prefix Icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
            <Input
              type="text"
              className="pl-10 h-[37px] text-[#6B7280] border rounded-md  w-full py-2 outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter domain name"
            />
          </div>

          <Button className=' block sm:flex sm:w-[167px]  w-full  align-center h-[37px] px-[15px] py-[10px] bg-[#EDE5FF] text-[14px] text-[#6C2BD9] font-medium border-0 rounded-md hover:bg-[#ede8f7] hover:text-[#714bb2]' onClick={handleScrape} variant="outline">Fetch & Save Details</Button>


        </div>
        {message && <p>Company added successfully</p>}
      </div>

      
    </>


  );
}
