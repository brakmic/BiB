-- This script creates an Access Control List, an Administrators group and a user called "admin"
-- The hashed password is: demo
-- It should serve as a starting point to configure the system because without a proper login admin rights
-- many functions would not be available. 

-- At login use "admin" + "demo" to enter the app.


INSERT INTO `acl` (`ID`, `CanAddMedia`, `CanAddReaders`, `CanAddUsers`, `CanAddUserGroups`, `CanRemoveMedia`, `CanRemoveReaders`, `CanRemoveUsers`, `CanRemoveUserGroups`, `CanModifyMedia`, `CanModifyReaders`, `CanModifyUsers`, `CanModifyUserGroups`) VALUES (1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

INSERT INTO `user_group` (`ID`, `Name`, `ACL_ID`) VALUES (1, 'Administrators', 1);

INSERT INTO `user` (`ID`, `Group_ID`, `ACL_ID`, `AccountName`, `FirstName`, `LastName`, `Password`, `IsActive`) VALUES (1, 1, 1, 'admin', 'Admin', 'Admin', 'MjZjNjY5Y2QwODE0YWM0MGU1MzI4NzUyYjIxYzRhYTY0NTBkMTYyOTVlNGVlYzMwMzU2YTA2YTkxMWMyMzk4M2FhZWJlMTJkNWRhMzhlZWViZmMxYjIxM2JlNjUwNDk4ZGY4NDE5MTk0ZDVhMjZjN2UwYTUwYWYxNTY4NTNjNzk=', 1);	