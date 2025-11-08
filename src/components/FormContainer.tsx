'use client';

// ✅ src/components/FormContainer.tsx
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

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const res = await fetch(`/api/formdata?table=${table}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        setRelatedData(json);
      } catch (err) {
        console.error('❌ Error fetching form data:', err);
      }
    };

    if (type !== 'delete') fetchRelatedData();
  }, [table, type]);

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
