"use server"

import { cookies } from "next/headers";

const base_url = process.env.NEXT_PUBLIC_DB_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export async function getResidents() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/resident`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch residents: ${res.status}`);
    const result = await res.json();
    return result.data?.docs || result.data || result;
  } catch (error) {
    console.error('Error getting residents:', error);
    throw error;
  }
}

export async function getEstates() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/estate`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch estates: ${res.status}`);
    const result = await res.json();
    return result.data?.docs || result.data || result;
  } catch (error) {
    console.error('Error getting estates:', error);
    throw error;
  }
}

export async function getOwners() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/admin`, { headers });
    const result = await res.json();
    return result.data?.docs || result.data || [];
  } catch (error) {
    console.error('Error getting owners:', error);
    throw error;
  }
}

export async function getPayments() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/invoice`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch payments: ${res.status}`);
    const result = await res.json();
    return result.data?.docs || result.data || result;
  } catch (error) {
    console.error('Error getting payments:', error);
    throw error;
  }
}

export async function getLogs() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/log`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch logs: ${res.status}`);
    const result = await res.json();
    return result.data?.docs || result.data || result;
  } catch (error) {
    console.error('Error getting logs:', error);
    throw error;
  }
}

export async function getLogById(id) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/log/${id}`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch log: ${res.status}`);
    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error('Error getting log by id:', error);
    throw error;
  }
}

export async function getResidentsByEstateId(estateId) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  
  try {
    const res = await fetch(`${base_url}/api/resident?estateID=${estateId}`, 
      { 
         headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
       });

    if (!res.ok) throw new Error(`Failed to fetch residents for estate: ${res.status}`);
    const {data} = await res.json();
    const users =  data?.docs || data;
    return users;

  } catch (error) {
    console.error('Error getting residents by estate id:', error);
    throw error;
  }
}

export async function getEstateById(id) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/estate/${id}`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch estate: ${res.status}`);
    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error('Error getting estate by id:', error);
    throw error;
  }
}

export async function getOwnerById(id) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/admin/${id}`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch owner: ${res.status}`);
    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error('Error getting owner by id:', error);
    throw error;
  }
}

export async function getJoinRequests() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/join-request`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch join requests: ${res.status}`);
    const result = await res.json();
    return result.data?.docs || result.data || [];
  } catch (error) {
    console.error('Error getting join requests:', error);
    throw error;
  }
}



export async function getJoinRequestById(id) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${base_url}/api/join-request/${id}`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch join request: ${res.status}`);
    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error('Error getting join request by id:', error);
    throw error;
  }
}

export default getEstates;