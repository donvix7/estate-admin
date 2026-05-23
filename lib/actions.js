"use server"

import { cookies } from "next/headers";

const base_url = process.env.NEXT_PUBLIC_DB_URL


export const serverLogin = async (dataOrEmail, maybePassword) => {
    let email = dataOrEmail;
    let password = maybePassword;

    // Handle case where an object is passed (as in current page.jsx)
    if (typeof dataOrEmail === 'object' && dataOrEmail !== null && !maybePassword) {
        email = dataOrEmail.email;
        password = dataOrEmail.password;
    }

    try {
        const res = await fetch(`${base_url}/auth/login/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        console.log('login response status:', res.status);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Login failed');
        }

        const result = await res.json();
        const cookieStore = await cookies()
        
        const token = result.token
        const user = result.data || result.user || result;
        
        cookieStore.set('currentUser', JSON.stringify(user), { path: '/' })
        if (token) {
            cookieStore.set('session_token', token, { 
                path: '/', 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production' 
            })
        }
        
        return { success: true, user: result };
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const createEstate = async (estateData) => {
    console.log(estateData);
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;
        
        const res = await fetch(`${base_url}/api/estate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(estateData),
        });
        if (!res.ok) throw new Error(`Failed to create estate: ${res.status}`);
        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error('Error creating estate:', error);
        throw error;
    } 
};

export const createOwner = async (ownerData) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;
        
        const res = await fetch(`${base_url}/api/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(ownerData),
        });
        if (!res.ok) throw new Error(`Failed to create owner: ${res.status}`);
        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error('Error creating owner:', error);
        throw error;
    } 
};

export const deleteEstate = async (id) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;
        
        const res = await fetch(`${base_url}/api/estate/${id}`, {
            method: 'DELETE',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });
        if (!res.ok) throw new Error(`Failed to delete estate: ${res.status}`);
        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error('Error deleting estate:', error);
        throw error;
    } 
};

export const deleteOwner = async (id) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;
        
        const res = await fetch(`${base_url}/api/admin/${id}`, {
            method: 'DELETE',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });
        if (!res.ok) throw new Error(`Failed to delete owner: ${res.status}`);
        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error('Error deleting owner:', error);
        throw error;
    } 
};

export const editOwner = async (id, ownerData) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;
        
        const res = await fetch(`${base_url}/api/admin/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(ownerData),
        });
        if (!res.ok) throw new Error(`Failed to edit owner: ${res.status}`);
        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error('Error editing owner:', error);
        throw error;
    } 
};

export const editEstate = async (id, estateData) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;
        
        const res = await fetch(`${base_url}/api/estate/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(estateData),
        });
        if (!res.ok) throw new Error(`Failed to edit estate: ${res.status}`);
        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error('Error editing estate:', error);
        throw error;
    } 
};

export const updateJoinRequest = async (id, status, requestData) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token')?.value;
        
        const res = await fetch(`${base_url}/api/join-request/${id}/decision`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({ decision: status }),
        });
        if (!res.ok) throw new Error(`Failed to update join request: ${res.status}`);

        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error('Error updating join request:', error);
        throw error;
    } 
};