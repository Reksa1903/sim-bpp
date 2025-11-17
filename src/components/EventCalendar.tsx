// src/components/EventCalendar.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, setValue] = useState<Value>(new Date());
  const router = useRouter();

  const handleChange = (nextValue: Value) => {
    setValue(nextValue);

    if (nextValue instanceof Date) {
      router.push(`?date=${nextValue.toLocaleDateString('en-US')}`);
    }
  };

  return (
    <Calendar
      onChange={handleChange}
      value={value}
      locale="id-ID"
    />
  );
};

export default EventCalendar;
