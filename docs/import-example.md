# Sample Import File for DevVault

This file demonstrates the format for importing multiple notes at once.

## Example entries:

1.
git merge combines branches by creating a new commit that has two parent commits. It preserves the complete history of both branches.
tags: git, merge, version-control
---
2.
useEffect cleanup function runs when component unmounts or before the effect runs again. Always return a cleanup function when setting up subscriptions or timers.

Example:
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(timer); // cleanup
}, []);
tags: react, hooks, useEffect, cleanup
---
3.
SQL JOIN types:
- INNER JOIN: returns only matching rows
- LEFT JOIN: all from left + matching from right
- RIGHT JOIN: all from right + matching from left
- FULL JOIN: all rows from both tables
tags: sql, database, joins, query
---
4.
Docker compose networking creates a default network where containers can reach each other by service name. Use service names as hostnames.
tags: docker, networking, compose, devops
---
5.
JWT tokens should be stored in httpOnly cookies, not localStorage, to prevent XSS attacks. Set secure flag for HTTPS-only transmission.
tags: security, jwt, authentication, cookies
---
