// src/components/FormContainer.tsx
'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const runtime = 'nodejs';

import FormModal from './FormModal';
import { useEffect, useState } from 'react';

export type FormContainerProps = {
  table:
  | 'penyuluh'
  | 'kelompoktani'
  | 'kisopertanian'
  | 'materi'
  | 'kegiatan'
  | 'dokumentasiacara'
  | 'pengumuman'
  | 'desabinaan';
  type: 'create' | 'update' | 'delete' | 'download';
  data?: any;
  id?: number | string;
  href?: string;
};

const FormContainer = ({ table, type, data, id, href }: FormContainerProps) => {
  const [relatedData, setRelatedData] = useState<any>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const res = await fetch(`/api/formdata?table=${table}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        setRelatedData(json);
      } catch (err) {
        setError(err.message);
        console.error('❌ Error fetching form data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (type !== 'delete') fetchRelatedData();
  }, [table, type]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <FormModal
      table={table}
      type={type}
      data={data}
      id={id}
      relatedData={relatedData}
      href={href}
    />
  );
};

export default FormContainer;
