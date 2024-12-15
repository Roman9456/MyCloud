# My Cloud

## Overview

This project is a React-based frontend application for [MyCloud](https://github.com/Roman9456/MyCloud_server), a cloud storage service. It is built with Vite as the development and build tool. The application uses Redux for state management, Axios for making API requests, and React Router for navigation. It provides a user interface to interact with the cloud storage system, allowing users to upload, manage, and view their files.

## Dependencies

- **React**: The core library for building user interfaces.
- **Redux**: A state management library.
- **@reduxjs/toolkit**: A set of tools to simplify Redux usage.
- **React Router DOM**: For routing and navigation.
- **Axios**: For making HTTP requests.
- **Vite**: The build and development server.
- **@testing-library/react**: For testing React components.
- **Prop-types**: For type-checking React props.
- **React Icons**: A library of popular icons for React applications.
- **Web Vitals**: For measuring performance metrics.

## Scripts

- `dev`: Starts the development server using Vite.
  ```bash
  npm run dev 

- `Build`:  Builds the project for production.
  ```bash
  npm run build

- `serve`:  Previews the production build..
  ```bash
  npm run serve 

  
## Setup

- To get started with this project, clone the repository and install the dependencies using npm or yarn:
  ```bash
  git clone <https://github.com/Roman9456/MyCloud.git> 
  cd Mycloud
  npm install 

- After the installation, run the development server:
  ```bash
  npm run dev


## How to Deploy "My Cloud" 
To deploy My Cloud, you'll need to follow these steps:

1. Set up the Backend
This frontend application interacts with a backend API to handle file uploads, downloads, and management. Ensure that you have the My Cloud backend set up and running. You can find the backend repository and deployment instructions [here](https://github.com/Roman9456/MyCloud_server.git).  

2. Configure API Endpoints
After the backend is set up, configure the frontend to interact with your backend's API. Create the .env file in the root of the project and update the API endpoint URLs.  
 - REACT_APP_API_URL=<your-api-url> 
 3. Build the Project
- Once the frontend and backend are connected, you can build the project for production::
  ```bash
  npm run build  

4. Serve the Build 
- After building the project, you can serve the production build using the following command:
  ```bash
  npm run serve 

5. Hosting
You can host the built project on any static file hosting service like:

- [Vercel](https://vercel.com): Vercel Hosting
- [Netlify](https://www.netlify.com): Netlify Hosting
- [GitHub Pages](https://pages.github.com): GitHub Pages

 Make sure to set up your hosting provider to point to the build directory generated by the npm run build command. 

 ## ESLint Configuration
 The project is configured to use ESLint with the following settings:

 - react-app and react-app/jest for standard React and Jest linting rules. 





 # My Cloud

## Описание

Этот проект — фронтенд-приложение для **My Cloud**, облачного хранилища. Оно построено на базе React и использует Vite как инструмент для разработки и сборки. В проекте применяется Redux для управления состоянием, Axios для выполнения API-запросов, и React Router для навигации. Это приложение предоставляет пользовательский интерфейс для взаимодействия с облачным хранилищем, позволяя пользователям загружать, управлять и просматривать свои файлы.

## Зависимости

- **React**: Основная библиотека для создания пользовательских интерфейсов.
- **Redux**:Библиотека для управления состоянием.
- **@reduxjs/toolkit**:  Набор инструментов для упрощения использования Redux.
- **React Router DOM**: Для маршрутизации и навигации.
- **Axios**: Для выполнения HTTP-запросов.
- **Vite**: Инструмент для сборки и разработки..
- **@testing-library/react**: Для тестирования компонентов React.
- **Prop-types**: Для проверки типов пропсов React..
- **React Icons**: Библиотека популярных иконок для React-приложений..
- **Web Vitals**: Для измерения показателей производительности

## Скрипты

- `dev`: Запускает сервер разработки с помощью Vite.
  ```bash
  npm run dev 

- `Build`:  Собирает проект в продакшн..
  ```bash
  npm run build

- `serve`:  Превьюирует сборку в продакшн...
  ```bash
  npm run serve 

  
## Установка

- Чтобы начать работу с проектом, клонируйте репозиторий и установите зависимости с помощью npm или yarn::
  ```bash
  git clone <https://github.com/Roman9456/MyCloud.git> 
  cd Mycloud
  npm install 

- После установки запустите сервер разработки::
  ```bash
  npm run dev


## Как развернуть "My Cloud" 
Чтобы развернуть My Cloud, выполните следующие шаги:

1. Настройка 
Это фронтенд-приложение взаимодействует с API на стороне бэкенда для обработки загрузки, скачивания и управления файлами. Убедитесь, что у вас настроен и работает бэкенд My Cloud. Репозиторий для бэкенда и инструкции по его развертыванию можно найти [Здесь](https://github.com/Roman9456/MyCloud_server.git). 


2. Настройка API-эндпоинтов
После настройки бэкенда обновите настройки в frontend для взаимодействия с его API. Создайте файл .env в корне проекта и укажите URL вашего API:
- REACT_APP_API_URL=<url вашего API> 

3. Сборка проекта
- После подключения фронтенда и бэкенда выполните сборку проекта в продакшн:
  ```bash
  npm run build  

4. Превью сборки
- После сборки проекта вы можете просмотреть его в продакшн-режиме:
  ```bash
  npm run serve 

5. Хостинг
Вы можете разместить собранное приложение на любом сервисе для хостинга статических файлов, например::

- [Vercel](https://vercel.com): Vercel Hosting
- [Netlify](https://www.netlify.com): Netlify Hosting
- [GitHub Pages](https://pages.github.com): GitHub Pages

 Make sure to set up your hosting provider to point to the build directory generated by the npm run build command. 

 ## Конфигурация ESLint
 The project is configured to use ESLint with the following settings:

 - react-app and react-app/jest for standard React and Jest linting rules. 




 



  










  




   
