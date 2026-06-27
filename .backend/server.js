const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Supabase Client ---
const SUPABASE_URL = 'https://mszigtijnoydxgwwlaez.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zemlndGlqbm95ZHhnd3dsYWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MjM5MDIsImV4cCI6MjA5ODA5OTkwMn0.-Bd7p6VHT5jxtqWPUFpkGhz4TbRzsClcXlIBASloajE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  },
  realtime: {
    transport: WebSocket
  }
});

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Serve frontend static files ---
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ==========================================================================
//  API ROUTES — Supabase-backed versions of the function endpoints
//  These handle s.functions.invoke() calls from the frontend client
// ==========================================================================

// --------------------------------------------------------------------------
//  POST /api/functions/register-user
//  Upsert pattern: find or create user by username
// --------------------------------------------------------------------------
app.post('/api/functions/register-user', async (req, res) => {
  try {
    const { username, mobile, referralCode, referredBy } = req.body;
    if (!username) return res.status(400).json({ error: 'username required' });

    // Try to find existing user
    const { data: existing, error: findErr } = await supabase
      .from('users')
      .select('*')
      .eq('name', username)
      .maybeSingle();

    if (findErr) {
      console.error('Find user error:', findErr);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (existing) {
      // User exists — update mobile if provided
      if (mobile) {
        await supabase.from('users').update({ phone: mobile }).eq('id', existing.id);
      }

      if (existing.is_banned) {
        return res.json({ banned: true, username: existing.name, ban_reason: existing.ban_reason || '' });
      }

      return res.json({
        id: existing.id,
        username: existing.name,
        mobile: existing.phone,
        joinDate: existing.created_at,
        referralCode: existing.referral_code || '',
        referredBy: existing.referrer_id,
        activePackage: existing.vip_level,
        balance: existing.balance || 0,
        withdrawalBalance: existing.withdrawal_balance || 0
      });
    }

    // Create new user
    const refCode = referralCode || Math.random().toString(36).substring(2, 10).toUpperCase();
    const newUser = {
      name: username,
      phone: mobile || '',
      password: username + '123', // default password
      referral_code: refCode,
      referrer_id: referredBy || null,
      balance: 0,
      is_banned: false,
      vip_level: null
    };

    const { data: created, error: createErr } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (createErr) {
      console.error('Create user error:', createErr);
      return res.status(500).json({ error: 'Registration failed: ' + createErr.message });
    }

    res.json({
      id: created.id,
      username: created.name,
      mobile: created.phone,
      joinDate: created.created_at,
      referralCode: created.referral_code,
      referredBy: created.referrer_id,
      activePackage: created.vip_level,
      balance: created.balance || 0,
      withdrawalBalance: created.withdrawal_balance || 0
    });
  } catch (err) {
    console.error('register-user error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// --------------------------------------------------------------------------
//  POST /api/functions/claim-daily-task
//  Claim daily ad-watching earnings
// --------------------------------------------------------------------------
app.post('/api/functions/claim-daily-task', async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });

    // Get user
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userErr || !user) return res.status(404).json({ error: 'User not found' });
    if (!user.vip_level) return res.status(400).json({ error: 'Active package required' });

    // Check if already claimed today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingClaim } = await supabase
      .from('tasks')
      .select('id')
      .eq('user_id', user_id)
      .eq('title', 'daily_task')
      .gte('completed_at', today + 'T00:00:00')
      .lte('completed_at', today + 'T23:59:59')
      .maybeSingle();

    if (existingClaim) return res.status(400).json({ error: 'Already claimed today' });

    // Determine earning amount based on VIP level
    const vipEarnings = {
      'VIP1': 100, 'VIP2': 200, 'VIP3': 400, 'VIP4': 800,
      'VIP5': 1500, 'VIP6': 2500, 'VIP7': 5000
    };
    const amount = vipEarnings[user.vip_level] || 50;

    // Create task record
    const { error: taskErr } = await supabase.from('tasks').insert({
      user_id: user_id,
      title: 'daily_task',
      status: 'completed',
      reward: amount,
      completed_at: new Date().toISOString()
    });

    if (taskErr) {
      console.error('Task insert error:', taskErr);
      return res.status(500).json({ error: 'Failed to record claim' });
    }

    // Update user balance
    const newBalance = (user.balance || 0) + amount;
    await supabase.from('users').update({ balance: newBalance }).eq('id', user_id);

    res.json({
      success: true,
      amount,
      balance: newBalance,
      withdrawalBalance: user.withdrawal_balance || 0
    });
  } catch (err) {
    console.error('claim-daily-task error:', err);
    res.status(500).json({ error: 'Failed to claim' });
  }
});

// --------------------------------------------------------------------------
//  POST /api/functions/submit-transaction
//  Handle deposit and withdrawal submissions
// --------------------------------------------------------------------------
app.post('/api/functions/submit-transaction', async (req, res) => {
  try {
    const {
      kind, user_id, amount, original_amount, discount_code, package_name,
      payment_method, whatsapp_number, transaction_id, screenshot_base64,
      screenshot_filename, account_number, network
    } = req.body;

    if (!kind || !user_id || !amount) {
      return res.status(400).json({ error: 'kind, user_id, amount required' });
    }

    if (kind === 'deposit') {
      const deposit = {
        user_id,
        amount: parseFloat(amount),
        status: 'pending',
        method: payment_method || 'Unknown'
      };

      const { data, error } = await supabase
        .from('deposits')
        .insert(deposit)
        .select()
        .single();

      if (error) {
        console.error('Deposit insert error:', error);
        return res.status(500).json({ error: 'Deposit failed: ' + error.message });
      }

      return res.json({ success: true, id: data.id, type: 'deposit', status: 'pending' });
    }

    if (kind === 'withdrawal') {
      // Check user balance
      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', user_id)
        .single();

      if (userErr || !user) return res.status(404).json({ error: 'User not found' });
      if (!user.vip_level) return res.status(400).json({ error: 'Active package required' });

      const amt = parseFloat(amount);
      if ((user.balance || 0) < amt) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Create withdrawal record
      const { data: withdrawal, error: wErr } = await supabase
        .from('withdrawals')
        .insert({
          user_id,
          amount: amt,
          status: 'pending',
          method: payment_method || 'Easypaisa'
        })
        .select()
        .single();

      if (wErr) {
        console.error('Withdrawal insert error:', wErr);
        return res.status(500).json({ error: 'Withdrawal failed: ' + wErr.message });
      }

      // Deduct balance
      await supabase.from('users')
        .update({ balance: (user.balance || 0) - amt })
        .eq('id', user_id);

      return res.json({ success: true, id: withdrawal.id, type: 'withdrawal', status: 'pending' });
    }

    res.status(400).json({ error: `Unknown kind: ${kind}` });
  } catch (err) {
    console.error('submit-transaction error:', err);
    res.status(500).json({ error: 'Transaction failed' });
  }
});

// --------------------------------------------------------------------------
//  POST /api/functions/user-history
//  Fetch transaction history by kind
// --------------------------------------------------------------------------
app.post('/api/functions/user-history', async (req, res) => {
  try {
    const { user_id, kind } = req.body;
    if (!user_id || !kind) return res.status(400).json({ error: 'user_id and kind required' });

    let query;
    if (kind === 'daily_task_claims' || kind === 'tasks') {
      query = supabase.from('tasks')
        .select('*')
        .eq('user_id', user_id)
        .order('completed_at', { ascending: false })
        .limit(100);
    } else if (kind === 'deposits') {
      query = supabase.from('deposits')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(100);
    } else if (kind === 'withdrawals') {
      query = supabase.from('withdrawals')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(100);
    } else {
      return res.status(400).json({ error: `Unknown kind: ${kind}` });
    }

    const { data, error } = await query;
    if (error) {
      console.error('History query error:', error);
      return res.status(500).json({ error: 'Query failed' });
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error('user-history error:', err);
    res.status(500).json({ error: 'Failed' });
  }
});

// --------------------------------------------------------------------------
//  POST /api/functions/admin-data
//  Multi-resource admin data endpoint
// --------------------------------------------------------------------------
app.post('/api/functions/admin-data', async (req, res) => {
  try {
    const { resource, user_id } = req.body;

    if (resource === 'referrals') {
      // Get users referred by this user
      const { data, error } = await supabase
        .from('users')
        .select('id, name, phone, created_at, vip_level, balance')
        .eq('referrer_id', user_id);

      if (error) return res.status(500).json({ error: error.message });
      return res.json({ data: data || [] });
    }

    if (resource === 'users') {
      const { data, error } = await supabase.from('users').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ data: data || [] });
    }

    if (resource === 'deposits') {
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ data: data || [] });
    }

    if (resource === 'withdrawals') {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ data: data || [] });
    }

    if (resource === 'settings') {
      // Return default settings since we don't have a settings table
      return res.json({
        data: {
          min_withdrawal: '500',
          max_withdrawal: '50000',
          withdrawal_fee: '2',
          referral_commission: '10'
        }
      });
    }

    res.status(400).json({ error: `Unknown resource: ${resource}` });
  } catch (err) {
    console.error('admin-data error:', err);
    res.status(500).json({ error: 'Failed' });
  }
});

// --------------------------------------------------------------------------
//  POST /api/functions/admin-update-status
//  Update deposit/withdrawal status (approve/reject)
// --------------------------------------------------------------------------
app.post('/api/functions/admin-update-status', async (req, res) => {
  try {
    const { table, id, status, user_id, amount, package_name } = req.body;
    if (!table || !id || !status) {
      return res.status(400).json({ error: 'table, id, status required' });
    }

    const tableName = table === 'deposit' ? 'deposits' : 'withdrawals';
    const { error } = await supabase
      .from(tableName)
      .update({ status })
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });

    // If approving a deposit, update user's VIP level and balance
    if (table === 'deposit' && status === 'approved' && user_id && amount) {
      const { data: user } = await supabase
        .from('users')
        .select('balance')
        .eq('id', user_id)
        .single();

      const updates = { balance: (user?.balance || 0) + parseFloat(amount) };
      if (package_name) updates.vip_level = package_name;

      await supabase.from('users').update(updates).eq('id', user_id);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('admin-update-status error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// --------------------------------------------------------------------------
//  POST /api/functions/admin-update-payment
//  Update payment method details
// --------------------------------------------------------------------------
app.post('/api/functions/admin-update-payment', async (req, res) => {
  try {
    // Payment methods are managed in Supabase if the table exists
    res.json({ success: true, message: 'Payment method update acknowledged' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// --------------------------------------------------------------------------
//  POST /api/functions/admin-update-settings
//  Update platform settings
// --------------------------------------------------------------------------
app.post('/api/functions/admin-update-settings', async (req, res) => {
  try {
    // Settings management placeholder
    res.json({ success: true, message: 'Settings update acknowledged' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// --------------------------------------------------------------------------
//  GET /api/query/:table
//  Generic query endpoint for s.from(table).select() compatibility
//  Translates query params into Supabase queries
// --------------------------------------------------------------------------
app.get('/api/query/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const params = req.query;

    let query = supabase.from(table).select('*');

    // Apply filters
    for (const [key, value] of Object.entries(params)) {
      if (key.startsWith('_')) continue; // Skip meta params

      if (key.endsWith('__neq')) {
        query = query.neq(key.replace('__neq', ''), value);
      } else if (key.endsWith('__gt')) {
        query = query.gt(key.replace('__gt', ''), value);
      } else if (key.endsWith('__gte')) {
        query = query.gte(key.replace('__gte', ''), value);
      } else if (key.endsWith('__lt')) {
        query = query.lt(key.replace('__lt', ''), value);
      } else if (key.endsWith('__lte')) {
        query = query.lte(key.replace('__lte', ''), value);
      } else if (key.endsWith('__in')) {
        query = query.in(key.replace('__in', ''), value.split(','));
      } else if (key.endsWith('__is')) {
        query = query.is(key.replace('__is', ''), value === 'null' ? null : value);
      } else {
        query = query.eq(key, value);
      }
    }

    // Apply ordering
    if (params._order) {
      query = query.order(params._order, {
        ascending: params._asc !== 'false'
      });
    }

    // Apply limit
    if (params._limit) {
      query = query.limit(parseInt(params._limit));
    }

    const { data, error } = await query;
    if (error) {
      console.error('Query error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error('query error:', err);
    res.status(500).json({ error: 'Query failed' });
  }
});

// --------------------------------------------------------------------------
//  GET /api/settings
//  Return platform settings
// --------------------------------------------------------------------------
app.get('/api/settings', (req, res) => {
  res.json({
    data: {
      min_withdrawal: '500',
      max_withdrawal: '50000',
      withdrawal_fee: '2',
      referral_commission: '10'
    }
  });
});

// --------------------------------------------------------------------------
//  Catch-all: serve frontend SPA for any non-API route
// --------------------------------------------------------------------------
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`\n==========================================`);
  console.log(`  Islamic Ads Earn — Supabase Edition`);
  console.log(`==========================================`);
  console.log(`  Server:    http://localhost:${PORT}`);
  console.log(`  Supabase:  ${SUPABASE_URL}`);
  console.log(`==========================================`);
  console.log(`\n  Frontend:  http://localhost:${PORT}`);
  console.log(`  API base:  http://localhost:${PORT}/api`);
  console.log(`\n  Function endpoints (backend fallback):`);
  console.log(`  POST /api/functions/register-user`);
  console.log(`  POST /api/functions/claim-daily-task`);
  console.log(`  POST /api/functions/submit-transaction`);
  console.log(`  POST /api/functions/user-history`);
  console.log(`  POST /api/functions/admin-data`);
  console.log(`  POST /api/functions/admin-update-status`);
  console.log(`  POST /api/functions/admin-update-payment`);
  console.log(`  POST /api/functions/admin-update-settings`);
  console.log(`  GET  /api/query/:table`);
  console.log(`  GET  /api/settings`);
  console.log(`==========================================\n`);
});

module.exports = app;
