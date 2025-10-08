#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  console.log('🛡️  CitiWatch Admin User Creation Tool\n');
  
  const fullName = await question('Enter admin full name: ');
  const email = await question('Enter admin email: ');
  const password = await question('Enter admin password: ');
  const adminKey = await question('Enter admin creation key: ');
  
  try {
    const response = await fetch('http://localhost:3000/api/User/CreateAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        adminKey
      }),
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('\n✅ Admin user created successfully!');
      console.log(`📧 Email: ${email}`);
      console.log(`👤 Role: Administrator`);
    } else {
      console.log('\n❌ Error creating admin user:', data.message);
    }
  } catch (error) {
    console.log('\n❌ Network error:', error.message);
    console.log('Make sure your development server is running on http://localhost:3000');
  }
  
  rl.close();
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

createAdmin();