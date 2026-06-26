import 'dotenv/config';

async function testApi() {
  const BASE_URL = 'http://localhost:3000/v1';
  console.log(`Starting API test via HTTP against ${BASE_URL}...`);

  try {
    // 1. Login as Admin
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aarav.sharma0@example.com',
        password: 'Password123!'
      })
    });
    console.log("Login HTTP Status:", loginRes.status);
    if (!loginRes.ok) {
      const text = await loginRes.text();
      throw new Error(`Login failed: ${text}`);
    }
    const loginBody = await loginRes.json();
    const token = loginBody.data.token;
    console.log("Login successful! Token acquired.");

    // 2. Search Users to find a student
    const usersRes = await fetch(`${BASE_URL}/admin/users?limit=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Search Users HTTP Status:", usersRes.status);
    const usersBody = await usersRes.json();
    const testUser = usersBody.data.users[1]; // Get a standard user/student
    console.log("Selected test user:", testUser.email, "ID:", testUser.id);

    // 3. Search Batches to find a batch
    const batchesRes = await fetch(`${BASE_URL}/admin/batches?limit=1`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Search Batches HTTP Status:", batchesRes.status);
    const batchesBody = await batchesRes.json();
    const testBatch = batchesBody.data.batches[0];
    console.log("Selected test batch:", testBatch.name, "ID:", testBatch.id);

    // 4. Create an Enrollment
    const createRes = await fetch(`${BASE_URL}/admin/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: testUser.id,
        batchId: testBatch.id,
        enrollmentType: 'oneTime',
        status: 0,
        amountPaid: 499,
        paymentStatus: 'created',
        remark: 'Test enrollment via scratch script'
      })
    });
    console.log("Create Enrollment HTTP Status:", createRes.status);
    const createBody = await createRes.json();
    console.log("Create Response:", JSON.stringify(createBody, null, 2));
    if (!createRes.ok) {
      throw new Error("Failed to create enrollment");
    }
    const enrollmentId = createBody.data.id;
    console.log("Enrollment created successfully! ID:", enrollmentId);

    // 5. Search Enrollments
    const searchRes = await fetch(`${BASE_URL}/admin/enrollments?q=${testUser.name.split(' ')[0]}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Search Enrollments HTTP Status:", searchRes.status);
    const searchBody = await searchRes.json();
    console.log("Search results count:", searchBody.data.enrollments.length);

    // 6. Get Enrollment Details
    const getRes = await fetch(`${BASE_URL}/admin/enrollments/${enrollmentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Get Enrollment HTTP Status:", getRes.status);
    const getBody = await getRes.json();
    console.log("Get Details Response:", JSON.stringify(getBody, null, 2));

    // 7. Update Enrollment
    const updateRes = await fetch(`${BASE_URL}/admin/enrollments/${enrollmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 1, // Active
        progress: 75,
        paymentStatus: 'captured',
        remark: 'Updated via scratch script'
      })
    });
    console.log("Update Enrollment HTTP Status:", updateRes.status);
    const updateBody = await updateRes.json();
    console.log("Update Response:", JSON.stringify(updateBody, null, 2));

    // 8. Delete Enrollment
    const deleteRes = await fetch(`${BASE_URL}/admin/enrollments/${enrollmentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Delete Enrollment HTTP Status:", deleteRes.status);
    const deleteBody = await deleteRes.json();
    console.log("Delete Response:", JSON.stringify(deleteBody, null, 2));

    // 9. Verify Deletion (Get Details again)
    const getDeletedRes = await fetch(`${BASE_URL}/admin/enrollments/${enrollmentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Get Deleted Enrollment HTTP Status (expected 400):", getDeletedRes.status);
    const getDeletedBody = await getDeletedRes.json();
    console.log("Get Deleted Response:", JSON.stringify(getDeletedBody, null, 2));

    console.log("All API CRUD checks completed successfully!");
  } catch (err) {
    console.error("HTTP Test failed:", err);
  }
  process.exit(0);
}

testApi();
