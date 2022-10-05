# Expensify

```
Authors 

Noelia Bentancor
Sofía Decuadra
Agustin Ferrari
```
[Deployment Configuration](#DeploymentConfiguration)

# Introduction

Expensify is a monolithic app developed in the context of Software Architecture in Practice.

The aim of this app is to manage family expenses.

# Functional requirements

**RF1: Administrator Registration:** Anyone can register as a family admin through the website.

**RF2: User registration by invitation:** Admins can invite other members and admins to the platform by sending them an email with a link to join the family.

**RF3: User authentication:** Users can authenticate by filling a login form that asks for their email and login password.

**RF4: Application Access Key Management:** The system allows admins to view and update the application access key (API KEY). This key is automatically generated when creating a family and is used to invoke public REST services.

**RF5: Category CRUD:** The system allows admins to create, modify and delete expense categories.

**RF6: Expense CRUD:** The system allows users to create expenses, but only the admins are allowed to modify and delete them.

**RF7: Family Home Page:** Upon login into the application, users are directed to the home page of their family. In this page, they can see the expenses registered for the month and have the possibility to filter them by date. Besides, a graph is displayed that groups the expenses by the given period of the category.

**RF8: Top 3 categories with more expenses (REST):** Users can consult the 3 categories with the most accumulated expenses in history for the family.

**RF9: Expense query for a category (REST):** Users can check the expenses they registered in a certain period for a certain category.


# Deployment Configuration
# <div id='DeploymentConfiguration' ></div>


## Configuration
## 

The image is uploaded in DockerHub repository noeliabentancor/my-expenses-app.

If any changes which need to be applied to the backend are made, use the following commands so as to build the image and push changes to DockerHub.

1. `docker build --tag noeliabentancor/my-expenses-app`

2. `docker push noeliabentancor/my-expenses-app`

3. Run task definition expensify-app in cluster

4. Attach instance to target group
After pushing the image, a new task should be started in order to apply changes to the server.

## RDS

RDS is in a private subnet, for consequence it can't be accessed from Internet. 
A tunnel connection needs to be set up, so as to connect to it.

**Endpoint for production**


```
my-expenses-prod.c8njidzohjqg.us-east-1.rds.amazonaws.com

```

## Backend configuration
## 
![](https://i.imgur.com/hmHNBqD.png)

![](https://i.imgur.com/wpaRFuh.png)

