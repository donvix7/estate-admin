"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEstate, updateJoinRequest } from '@/lib/actions';

const RequestDecisionButtons = ({ id, request }) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRequestDecision = async (decision) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await updateJoinRequest(id, decision);
      
      if (decision === 'approved') {
        const estatePayload = {
          name: request.name,
          location: {
            state: request.location?.state || "",
            city: request.location?.city || "",
            address: request.location?.address || ""
          },
          officeContact: request.officeContact || [],
          amenities: request.amenities || [],
          password: request.password,
          tier: 'Free', // Mandatory field in model
          status: 'Active',
          units: 0,
          sqft: 0,
          admin: {
            email: request.officeContact?.[0] || "",
            phone: request.officeContact?.[1] || ""
          },
          owner: {
            email: request.officeContact?.[0] || "",
            phone: request.officeContact?.[1] || ""
          },
          manager: {
            email: request.officeContact?.[0] || "",
            phone: request.officeContact?.[1] || ""
          }
        };

        await createEstate(estatePayload);
        router.push('/dashboard/estates');
      } else {
        router.push('/dashboard/requests');
      }
    } catch (error) {
      console.error('Error processing decision:', error);
      alert('Failed to process request decision');
    } finally {
      setIsProcessing(false);
    }
  };

  const isActionable = request.status === 'pending';

  return (
    <div className="flex gap-4">
      <button 
        disabled={isProcessing || !isActionable}
        onClick={() => handleRequestDecision('rejected')}
        className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white px-8 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest cursor-pointer font-manrope transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-500/10 disabled:hover:text-rose-500"
      >
        {isProcessing ? 'Processing...' : 'Reject Request'}
      </button>
      <button 
        disabled={isProcessing || !isActionable}
        onClick={() => handleRequestDecision('approved')}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 cursor-pointer font-manrope transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
      >
        {isProcessing ? (
          'Processing...'
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">verified</span>
            {request.status === 'approved' ? 'Already Approved' : 'Approve & Create Estate'}
          </>
        )}
      </button>
    </div>
  );
};

export default RequestDecisionButtons;
