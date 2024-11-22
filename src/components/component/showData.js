'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IoIosArrowBack } from 'react-icons/io';
import { MdNavigateNext } from 'react-icons/md';

export default function ShowData({ update }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [copied, setCopied] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/api/company');
        setCompanies(res.data.data);
        console.log("data", res);

      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, [update]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCompanies([]);
    } else {
      const visibleCompanies = companies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      setSelectedCompanies(visibleCompanies.map((company) => company._id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter((companyId) => companyId !== id));
    } else {
      setSelectedCompanies([...selectedCompanies, id]);
    }
  };

  const deleteSelectedCompanies = async () => {
    if (selectedCompanies.length === 0) {
      alert('No companies selected.');
      return;
    }

    try {
      const response = await axios.post('/api/delete', { ids: selectedCompanies });
      if (response.data.success) {
        alert('Selected companies deleted successfully!');
        setSelectedCompanies([]);
        setSelectAll(false);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error deleting companies:', error);
    }
  };

  const exportSelectedToCSV = () => {
    if (selectedCompanies.length === 0) {
      alert('No companies selected for export.');
      return;
    }

    const dataToExport = selectAll
      ? companies
      : companies.filter((company) => selectedCompanies.includes(company._id));

    const csvContent = [
      ['Name', 'Description', 'Email', 'Phone'].join(','),
      ...dataToExport.map(
        (company) =>
          `"${company.name}","${company.description}","${company.email}","${company.phone}"`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'companies.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const totalPages = Math.ceil(companies.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSelectAll(false);
      setSelectedCompanies([]);
    }
  };

  const displayedCompanies = companies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-[#fff]">
      <div className="flex items-center gap-4  p-4 sm:flex-row flex-col-reverse ">
        <p className='font-medium'>{selectedCompanies.length} selected</p>
        <Button
          className="bg-gray-200 text-gray-600 sm:w-auto w-full"
          onClick={deleteSelectedCompanies}
          disabled={selectedCompanies.length === 0}
        >
          Delete Selected
        </Button>
        <Button
          className="bg-gray-200 text-gray-600 sm:w-auto w-full"
          onClick={exportSelectedToCSV}
          disabled={selectedCompanies.length === 0}
        >
          Export as CSV
        </Button>
      </div>

      <div className="sm:overflow-x-auto bg-white rounded-lg flex flex-col justify-between sm:h-[calc(100vh-158px)] h-[500px]">
        {/* Scrollable Table Container */}
        <div className="sm:overflow-auto overflow-visible flex-1 sm:mb-[50px] mb-[100px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <table className="min-w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3">COMPANY</th>
                <th className="px-6 py-3">SOCIAL PROFILES</th>
                <th className="px-6 py-3">DESCRIPTION</th>
                <th className="px-6 py-3">ADDRESS</th>
                <th className="px-6 py-3">PHONE</th>
                <th className="px-6 py-3">EMAIL</th>
              </tr>
            </thead>
            <tbody>
              {displayedCompanies.map((company) => (
                <tr key={company._id} className="border-b">
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company._id)}
                      onChange={() => handleCheckboxChange(company._id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Image src={company.logo} alt="logo" width={20} height={20} />
                      <Link href={`/company/${company._id}`} className="text-[#6C2BD9] ">

                        {String(company.name).charAt(0).toUpperCase() + String(company.name).slice(1)}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <a href={company?.facebook} target="_blank" rel="noopener noreferrer">
                        <img src="/facebook.svg" alt="Facebook" />
                      </a>
                      <a href={company?.twitter} target="_blank" rel="noopener noreferrer">
                        <img src="/twitter.svg" alt="Twitter" />
                      </a>
                      <a href={company?.linkedin} target="_blank" rel="noopener noreferrer">
                        <img src="/linkedIn.svg" alt="LinkedIn" />
                      </a>

                    </div>
                  </td>
                  <td className="px-6 py-3 truncate max-w-xs">{company.description}</td>
                  <td className="px-6 py-3 truncate max-w-xs">{company.address}</td>
                  <td className="px-6 py-3 text-[#6C2BD9]">{company.phone}</td>
                  <td className="px-6 py-3 text-[#6C2BD9]">{company.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fixed Pagination */}
        <div className="relative sm:fixed sm:bottom-4 sm:left-4 flex items-center gap-4 bg-white p-4 w-full rounded-lg">
          <p className="text-gray-600 sm:flex block">
            Showing {displayedCompanies.length} of {companies.length}
          </p>
          <div className='flex flex-row '>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-600"
            >
              <IoIosArrowBack />
            </Button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 ${currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-200 text-gray-600"
            >
              <MdNavigateNext />
            </Button>
          </div>

        </div>
      </div>



    </div>
  );
}
