# BakeItEasy (NUS IS3106 Project)

# Description
BakeItEasy is an application that seeks to connect small baking businesses in Singapore with customers looking to purchase freshly baked goods for any occasion. Our user-friendly platform simplifies the traditional process of informal orders and enquiries on social media by providing a one-stop-shop experience that streamlines information management and expands businesses' reach.

Businesses can easily create an account and list their products for sale with detailed descriptions, pictures, and pricing. Customers can then browse available products by category or use the search function to find their desired products and place orders directly through our platform.

To ensure timely deliveries, our calendar feature enables businesses to track orders and schedule deliveries efficiently. Additionally, our review function allows customers to provide valuable feedback, helping businesses improve their products and services, while providing other customers with informed purchase decisions.

Our forum enables members of the community to share baking-related experiences, connect with others, and engage in discussions on relevant topics. Users can post or comment to share recipes, give out ingredients, or simply talk about baking-related stuff.

In the unlikely event of disputes between businesses and customers, our dedicated team of administrators provides support to mediate and find fair resolutions.

Overall, BakeItEasy is an indispensable tool for small baking businesses in Singapore, enabling them to grow and reach new customers while providing a seamless, convenient, and enjoyable experience for customers.

# Features
BakeItEasy consists of 3 portals, namely the buyer, seller, and admin portal. Below are the features for each respective portal.

## Buyer Portal

**User authentication**

Buyers are able to sign in with their registered email and password. They can create a new account with a unique username, email and phone number. They can also upload a profile picture. A forget password feature also links them to their local email application to send a request to BakeItEasy administrators to change their password. If users are trying to access the buyer pages without logging in, they will be redirected to the buyer login page.

**Profile**

Buyers are able to view and edit their personal details. They can also change their password.

**Home Page**

Their home page will be populated with seller’s listings, where they can explore different bakes created by sellers. Buyers are able to filter the listings according to categories (e.g. cake, tart, pie), and a search bar allows them to search by keywords. Buyers can also view listings created by sellers they follow.

**Orders**

When buyers would like to buy a product, they can create an order from a listing. Customisation options (e.g. colour, quantity, customisation notes) allow buyers to be specific in their requests. They can also choose a preferred date of completion (that automatically takes into account the seller’s minimum preparation time).

Order statuses (pending, accepted, rejected, completed, cancelled) can be viewed at a glance, thus keeping buyers updated and giving them a seamless view of their order progress.

Buyers can create a review for every unique order, that rates the seller and provides constructive feedback to the seller and future buyers. Should the interaction between a buyer and seller be undesirable, the buyer can also create a report against the seller, and BakeItEasy administrators will provide follow-up actions.

**Forum**

A common forum between buyers and sellers allows all BakeItEasy users to communicate and share information concurrently. Users are able to search for posts by different categories (e.g. #sharingIngredients, #discussion) and create their own posts. They can build onto different posts by commenting on them, thus creating a convenient social feature that promotes baking-related information sharing and learning.

## Seller Portal

**User Authentication**

Sellers are able to sign in with their registered email and password. They can create a new account with a unique username, email and phone number. They can also upload a profile picture. A forget password feature also links them to their local email to send a request to BakeItEasy administrators to change their password. If users are trying to access the seller pages without logging in, they will be redirected to the seller login page.

**Profile**

Sellers are able to view and edit their personal details. They can also change their password.

**Listings**

Sellers are able to create their listings where they can state the name, category, price, max quantity per order, description, minimum preparation time, and upload pictures of their product. They can then make edits to their listings any time they want. These listings will be viewed by potential customers and order creation will be through the individual listing.

**Appointments**

Sellers are able to view their appointments in a calendar format, which are automatically created once an order is created. This is to provide easy reference for the seller to manage his or her orders.

**Orders**

After buyers make an order, sellers will be able to see that they have an incoming order. They can view the order’s details and decide whether to accept or reject the order. The buyer will be updated accordingly depending on the seller’s action. For orders that are accepted, the seller can prepare and deliver it on the expected collection date and proceed to mark the order as completed.

Order statuses (pending, accepted, rejected, completed, cancelled) can be viewed at a glance, thus keeping sellers updated and giving them a seamless view of their order progress.

**Forum**

A common forum between buyers and sellers allows all BakeItEasy users to communicate and share information concurrently. Users are able to search for posts by different categories (e.g. #SharingIngredients, #discussion) and create their own posts. They can build onto different posts by commenting on them, thus creating a convenient social feature that promotes baking-related information sharing and learning.

## Admin Portal

**User Authentication**

Admins are able to log in with their given email and password. If users are trying to access the admin pages without logging in, they will be redirected to the admin login page.

**Profile**

Admins are able to view and edit their personal details. They can also change their password.

**Reports**

Admins are able to review reports and do the necessary investigation before opting to ban the user or dismiss the report.

# Technologies Used
Frontend: React.js, Chakra UI

Backend: Java EE, MySQL, Cloudinary

Prototype & Style Guide: Figma *[View here](https://tinyurl.com/BakeItEasyStyleGuide)*

# Setup Instructions

## Backend
To run the project on the backend, open the BakeItEasy project in NetBeans, then create a MySQL database named ‘BakeItEasy’. Remember to select ‘mysql.sys@localhost’.

Afterwards, create the JDBC resource for this database.

Lastly, start GlassFish Server 5.1.0.

Go back into the Projects folder, right-click BakeItEasy’. Select ```Clean and Build```, then click ```Run```.

## Frontend
After cloning the project, open BakeItEasy-react in VSCode and run ```npm install``` to download the dependencies from ```package.json```.

To run the project on the frontend, run ```npm start```.
