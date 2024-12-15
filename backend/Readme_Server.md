# Project Setup Guide

This guide will help you set up and run the project on your server from scratch using Nginx, Gunicorn, and Django.

---


### Prerequisites

Before starting, make sure you have the following installed on your server:

- **Ubuntu 20.04 or later** (or any other compatible Linux distribution)
- **Python 3.x** (preferably 3.8 or later)
- **pip** (Python package manager)
- **virtualenv** (Python virtual environment tool)
- **Nginx**
- **Gunicorn** (WSGI HTTP Server)
- **SSL certificates** (for HTTPS)

### Step-by-Step Setup

1. **Update the System:**
   First, update your system packages.
   ```bash
   sudo apt update && sudo apt upgrade -y

2. **Install Required Packages:** Install Python, pip, virtualenv, and Nginx:
   ```bash
   sudo apt install python3 python3-pip python3-venv nginx 

3. **Set Up a Virtual Environment:** Navigate to your project directory, create a virtual environment, and activate it.
   ```bash
   cd /path/to/your/project
   python3 -m venv venv
   source venv/bin/activate 

4. **Install Project Dependencies:** Install the necessary Python dependencies from requirements.txt.
 ```bash
   pip install -r requirements.txt  
   ```
5. **Configure Gunicorn:** Install Gunicorn if it's not in your requirements.txt.
 ```bash
   pip install gunicorn
   ```
6. **Collect Static Files:** Run the Django command to collect static files.
 ```bash
   python manage.py collectstatic
   ```
7. **Configure Nginx:** Set up an Nginx configuration file for your project. Edit the file /etc/nginx/sites-available/default to match the following configuration:
```nginx 
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/selfsigned.key;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /media/ {
        alias /path/to/your/project/media/;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}
``` 
8. **Create Gunicorn Service:** Create a Gunicorn systemd service file in /etc/systemd/system/gunicorn.service: 
```ini 
[Unit]
Description=gunicorn daemon for Django project
After=network.target

[Service]
User=your-user
Group=your-group
WorkingDirectory=/path/to/your/project
ExecStart=/path/to/your/project/venv/bin/gunicorn --workers 3 --bind unix:/path/to/your/project/gunicorn.sock main.wsgi:application

[Install]
WantedBy=multi-user.target
``` 
9. **Enable and Start Services:** Enable and start both Gunicorn and Nginx.
```bash 
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl restart nginx
``` 
10. **Access the Site:** Visit your site by navigating to https://your-domain.com.

___

# Russian
# Руководство по настройке проекта

Это руководство поможет вам настроить и запустить проект на вашем сервере с нуля, используя Nginx, Gunicorn и Django.

---

## Требования

Прежде чем начать, убедитесь, что на вашем сервере установлены следующие компоненты:

- **Ubuntu 20.04 или позднее** (или любая совместимая Linux дистрибуция)
- **Python 3.x** (предпочтительно 3.8 или позднее)
- **pip** (менеджер пакетов Python)
- **virtualenv** (инструмент для виртуальных окружений Python)
- **Nginx**
- **Gunicorn** (WSGI HTTP сервер)
- **SSL сертификаты** (для HTTPS)

---

## Пошаговая настройка

1. **Обновите систему:**
   Сначала обновите системные пакеты.
   ```bash
   sudo apt update && sudo apt upgrade -y

2. **Установите необходимые пакеты  Python, pip, virtualenv и Nginx**
   ```bash
   sudo apt install python3 python3-pip python3-venv nginx 

3. **Создайте виртуальное окружение.** Перейдите в каталог вашего проекта, создайте виртуальное окружение и активируйте его: 
   ```bash
   cd /path/to/your/project
   python3 -m venv venv
   source venv/bin/activate 

4. **Установите зависимости проекта** Установите необходимые зависимости Python из requirements.txt:
 ```bash
   pip install -r requirements.txt  
   ```
5. **Настройте Gunicorn.** Установите Gunicorn, если он не указан в requirements.txt:
 ```bash
   pip install gunicorn
   ```
6. **Соберите статические файлы.** Выполните команду Django для сбора статических файлов:
 ```bash
   python manage.py collectstatic
   ```
7. **Настройте Nginx:**Настройте файл конфигурации Nginx для вашего проекта. Отредактируйте файл /etc/nginx/sites-available/default, чтобы он соответствовал следующей конфигурации:
```nginx 
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/selfsigned.key;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /media/ {
        alias /path/to/your/project/media/;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}
``` 
8. **Создайте службу Gunicorn:** Создайте файл службы Gunicorn в /etc/systemd/system/gunicorn.service: 
```ini 
[Unit]
Description=gunicorn daemon для Django проекта
After=network.target

[Service]
User=your-user
Group=your-group
WorkingDirectory=/path/to/your/project
ExecStart=/path/to/your/project/venv/bin/gunicorn --workers 3 --bind unix:/path/to/your/project/gunicorn.sock main.wsgi:application

[Install]
WantedBy=multi-user.target

``` 
9. **Активируйте и запустите службы** Активируйте и запустите Gunicorn и Nginx:
```bash 
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl restart nginx
``` 
10. **Доступ к сайту** Перейдите по адресу https://your-domain.com.

___
