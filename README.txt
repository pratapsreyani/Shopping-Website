
** THIS IS THE INITIAL README CREATED FOR CS602 README FILE**

Hello

This is a small description of the layout behind this project. I apologize for its
incompleteness. Nodejs and MongoDB are very new to me and the point of this project was to
challenge myself, which this has. I have learned many things from it. I do not like turning
in something that is not fully complete but I simply ran out of time to figure out my issues.

Portions of this project are not complete*

((code is located in routes folder for what is completed so far for the functionalities below))

- **Customer order edit/delete -- layout is there, basic code structure in place.
                Wanted to use same implementation for the product add and edit but cannot seem to get it to work.

- **Product quantity update when purchasing

- **Search -- tried using .find(), .query(), .findOne() and full text search. Cannot seem to be implementation to work correctly

- **RESTful API -- base file structure is there but not completed

Completed functionality:

- show product list
- ordering of products
- select from list and order
- show orders pertaining to customers
- add a product
- delete a product
- update a product
- show list of all customers

--------------------------------------------------------------------------------------

-You must be logged in to purchased products.
-Will be forced to log in when trying to checkout.
-Create new user and the user can see their order history.
-Admin can see all users order history when no one is logged in.
-When checking out, please use STRIPE test Mastercard number,
referenced in comments in the code

---------------------------------------------------------------------------------------

Currently there are some nuances to the UI. The Admin View and Customer view change when
 logged in or not logged in. Primarily the view of not being logged in is the view that
 the admin would see. When logged in some buttons on the header change.
