'use client';

export const dynamic = 'force-dynamic';

import FormModal from './FormModal';
import { useEffect, useState } from 'react';
import type { TableName } from './forms/tableRegistry';

// === DEFINE TYPES HERE ===
export type FormContainerProps = {
  table: TableName;
  type: 'create' | 'update' | 'delete' | 'download';
  data?: any;
  id?: number | string;
  href?: string;
};

const FormContainer = ({ table, type, data, id, href }: FormContainerProps) => {
  const [relatedData, setRelatedData] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        const res = await fetch(`/api/formdata?table=${table}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const json = await res.json();
        setRelatedData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (type !== 'delete') fetchRelatedData();
  }, [table, type]);

  if (loading) return null;
  if (error) return null;

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
