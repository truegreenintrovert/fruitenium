
import { supabase } from './supabase';

export const api = {
  // Auth
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  register: async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  },

  // Products
  getProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active');
    
    if (error) throw error;
    return data;
  },

  getProduct: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Orders
  createOrder: async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getUserOrders: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Support Tickets
  createTicket: async (ticketData) => {
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticketData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getUserTickets: async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        orders (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Contact Form
  submitContact: async (formData) => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([formData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Profile
  updateProfile: async (profileData) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getProfile: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  }
};
