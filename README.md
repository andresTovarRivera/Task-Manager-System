# Task-Manager-System
Allows users to create, view, update, and delete tasks. The system will provide features like marking tasks as complete or incomplete and filtering tasks based on their status. Backend development with .NET Core, frontend development with React, database SQL.

## Run local

1- Open project in Visuals studio

2- Change DefaultConnection in **appsettings.json**

> "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=TaskManager;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False"

3- Run taskSystem.server with profile https

<p align="center">
   <img width="256" height="43" alt="image"  src="https://github.com/user-attachments/assets/3e47b86d-0384-4470-b1a8-a3159ad655a6" />
</p>

4- Open in a Browser 
- App =  https://localhost:52093/
- Swagger = https://localhost:8080/swagger/index.html

>[!WARNING]
> ## Run with docker (http)
> 1- Open a terminal in the project folder
>
> 2- Go to docker desktop and delete running containers
>
> 3- Run docker compose
> docker-compose up --build
>
> 4- verify that the new container is running
>
> 5- Open in a Browser 
> http://localhost:8080/swagger/index.html

- To create the images manually
Pull SQL server image wiht the next command

> docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Password12345!" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest

- Run command to create image of the project

> docker build -t tasksystemserver:dev .

## Use the Task Manager App
The first landing page is login

<p align="center">
<img width="270" height="388" alt="image" src="https://github.com/user-attachments/assets/24efb2b3-c435-49bf-bbd3-20f9b3b75140" />
</p>

By default there are 3 users created
> user: admin 
> Password: 123
>
> user: admin2 
> Password: 456
>
> user: admin3 
> Password: 789 

If you login with admin user, you will see the home page with 4 demo task

<p align="center">
<img width="1468" height="712" alt="image" src="https://github.com/user-attachments/assets/61a5880d-84ed-4e4a-8e69-5d2e742ffa5f" />
</p>

you can add, update and delete tasks, also filter by status (completed or incomplete).

Also you can drag and drop using the right top dots icon.

If you press add new task or the botton "+" in the top right, you will be redirect to create task page.(saem flow for update task)

<p align="center">
<img width="305" height="462" alt="image" src="https://github.com/user-attachments/assets/d04629a9-000a-4c84-ab95-23148b20146f" />
</p>

## Swagger page

You must be loged to use any method in swagger page. First you have to use the method User/Authenticate 

<p align="center">
<img width="405" height="456" alt="image" src="https://github.com/user-attachments/assets/c7086df6-baac-44d3-b4ec-dc478a3a1901" />
</p>

You can use admin credentials and you will get the next response

<p align="center">
<img width="1752" height="847" alt="image" src="https://github.com/user-attachments/assets/2a27dcfa-4b1c-4ed9-8489-7b3d22f2151f" />
</p>

You have to copy the token provided 

* example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYmYiOjE3NTYyMjE4NTMsImV4cCI6MTc1NjgyNjY1MywiaWF0IjoxNzU2MjIxODUzfQ._KWLAfudcyQxUazbeiswrgE5qnDofAE2Rw2X1XFH28A

And paste in the authorize format (Use the button <img width="195" height="46" alt="image" src="https://github.com/user-attachments/assets/e23bb666-ca11-4f22-b4a9-9e269b86fb46" />
 on the top right of the page)

<p align="center">
<img width="833" height="412" alt="image" src="https://github.com/user-attachments/assets/c76a74fc-50da-43be-ab23-9b284c492b8f" />
</p>

Press Authorize and close the modal.

Now you can use all task methods.

> **Note:** in case of default users are not available,  you can create users with the register botton or using method User/createUser in swagger
<p align="center">
<img width="288" height="421" alt="image" src="https://github.com/user-attachments/assets/09a1faf4-9b48-4465-a074-2847eb11c075" />
</p>


 



