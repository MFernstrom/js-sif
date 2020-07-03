// Code based on example from https://www.npmjs.com/package/mysql and modified with injection vectors

connection.query(`
SELECT *
FROM users
WHERE userId = ${userId}`, function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
