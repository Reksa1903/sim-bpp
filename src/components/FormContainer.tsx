'use client';

import { useEffect, useState } from 'react';
import FormModal from './FormModal';
import { TABLES, TableName } from './forms/tableRegistry';

export type FormContainerProps = {
  table: TableName;
  type: 'create' | 'update' | 'delete' | 'download';
  data?: any;
  id?: number | string;
  href?: string;
};

const FormContainer = ({ table, type, data, id, href }: FormContainerProps) => {
  const [relatedData, setRelatedData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const res = await fetch(`/api/formdata?table=${table}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setRelatedData(json);
      } catch (err: any) {
        setError(err.message);
        console.error("❌ Error fetching relatedData:", err);
      } finally {
        setLoading(false);
      }
    };

    if (type !== "delete") fetchRelatedData();
  }, [table, type]);

  if (loading) return null; // atau spinner
  if (error) return null;   // atau toast optional

  return (
    <FormModal
      table={table}
      type={type}
      data={data}
      id={id}
      href={href}
      relatedData={relatedData}
    />
  );
};

export default FormContainer;
