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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/formdata?table=...`
      );
      const json = await res.json();
      setRelatedData(json);
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
