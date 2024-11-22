'use client';

import { useState, useEffect } from 'react';
import AddUrl from '@/components/component/addUrl';
import ShowData from '@/components/component/showData';
import axios from 'axios';

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data initially
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/company');
      setCompanies(res.data.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial data load
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Add company
  const addCompany = (newCompany) => {
    setCompanies((prev) => [...prev, newCompany]); // Optimistically add
  };

  // Delete companies
  const deleteCompanies = (ids) => {
    setCompanies((prev) => prev.filter((company) => !ids.includes(company._id))); // Optimistically delete
  };

  return (
    <div>
      <AddUrl onCompanyAdded={addCompany} />
      <ShowData companies={companies} onDeleteCompanies={deleteCompanies} refreshData={fetchCompanies} loading={loading} />
    </div>
  );
}
