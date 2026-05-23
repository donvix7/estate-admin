import React, {  } from 'react';
import Link from 'next/link';
import { getEstates } from '@/lib/services';
import EstateList from '@/components/EstateList';

const EstatesPage = async () => {
  const estates = await getEstates();

  return (
    <div className="p-10 space-y-10 min-h-screen bg-white dark:bg-slate-900">
      <EstateList estates={estates} />
    </div>
  );
};

export default EstatesPage;