#DevTinder APIs

AuthRouter
-Post/signup
-Post/login
-Post/logout

ProfileRouter
-GET/profile/view
-Patch/profile/edit
-Patch/profile/password

ConnectionRequestRouter
-Post/request/send/interested/:userID
-Post/request/send/ignored/:userID
-Post/request/review/accepted/:requestID
-Post/request/review/rejected/:requestId

UserRouter
-Get/user/connections
-Get/user/requests
-Get/user/feed - Gets you the profiles of other users on platform

status: ignored , interested , accepted , rejected
