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
   ```
2. **Install Required Packages:** Install Python, pip, virtualenv, and Nginx:
   ```bash
   sudo apt install python3 python3-pip python3-venv nginx
   ```
3. **Set Up a Virtual Environment:** Navigate to your project directory, create a virtual environment, and activate it.
   ```bash
   cd /path/to/your/project
   python3 -m venv venv
   source venv/bin/activate
   ```
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

7. **Configure Nginx (with SSL):** To ensure your site is secure with HTTPS, you need an SSL certificate. You can either generate a self-signed certificate or, for production use, obtain a free SSL certificate from ​**Let's Encrypt**​.

##### **Option 1: Generate a Self-Signed SSL Certificate**

If you don't need a trusted SSL certificate and just want to set up HTTPS for testing or internal use, you can generate a self-signed certificate.

1. **Generate a Self-Signed Certificate:**
   Run the following commands to generate your SSL certificate and key:
   ```bash
   sudo mkdir -p /etc/ssl/private
   sudo mkdir -p /etc/ssl/private
   sudo openssl req -newkey rsa:2048 -nodes -keyout /etc/ssl/private/selfsigned.key -x509 -out /etc/ssl/certs/selfsigned.crt
   ```

You'll be prompted to provide information for the certificate, such as the country, organization name, and common name (this should be your domain name).

2. **Configure Nginx to Use SSL:**

Now that you have your self-signed certificate, you can update the Nginx configuration to use SSL.

Edit the file `/etc/nginx/sites-available/default` to match the following configuration:

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
}```
```

##### **Option 2: Obtain an SSL Certificate from Let's Encrypt (Recommended for Production)**

If you want a trusted SSL certificate, you can use ​**Let's Encrypt**​, which provides free SSL certificates

1. **Install Certbot:**:

Certbot is a tool that automates the process of obtaining and renewing Let's Encrypt SSL certificates.

First, install Certbot and the Nginx plugin:

```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Obtain the SSL Certificate**:
   Run the following command to automatically obtain and install the SSL certificate for your domain:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

Certbot will automatically configure your Nginx server to use the new certificate. You’ll be prompted to enter an email address and agree to the terms and conditions.

3. **Automatic SSL Certificate Renewal:**
   Let's Encrypt certificates are only valid for 90 days, so you need to set up automatic renewal. Certbot will automatically configure a cron job for this. To manually test the renewal process, you can run:
   ```
   sudo certbot renew --dry-run
  
   ``` 
4. **Update Nginx Configuration for Let's Encrypt (Optional)** Certbot will automatically update your Nginx configuration to use the Let's Encrypt certificates, but in case you need to manually verify it, the updated configuration should look like this:
``` nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

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
**Restart Nginx to Apply Changes** 
```bash
sudo systemctl restart nginx
``` 
* Self-signed certificates are only recommended for internal or testing environments, as browsers will show warnings for users accessing a website with a self-signed certificate.
* Let's Encrypt provides trusted SSL certificates, which is highly recommended for production sites.


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

---

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
   ```
2. **Установите необходимые пакеты  Python, pip, virtualenv и Nginx**
   ```bash
   sudo apt install python3 python3-pip python3-venv nginx
   ```
3. **Создайте виртуальное окружение.** Перейдите в каталог вашего проекта, создайте виртуальное окружение и активируйте его:
   ```bash
   cd /path/to/your/project
   python3 -m venv venv
   source venv/bin/activate
   ```
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

### 7. **Настройка Nginx (с SSL):** 
Чтобы обеспечить безопасность вашего сайта через HTTPS, вам необходим SSL сертификат. Вы можете либо создать самоподписанный сертификат, либо получить бесплатный SSL сертификат от **Let's Encrypt** для продакшн использования.

##### **Вариант 1: Создание самоподписанного SSL сертификата**

Если вам не требуется доверенный SSL сертификат и вы хотите настроить HTTPS для тестирования или внутреннего использования, вы можете создать самоподписанный сертификат.

1. **Создание самоподписанного сертификата:**
   Выполните следующие команды для генерации вашего SSL сертификата и ключа:
   ```bash
   sudo mkdir -p /etc/ssl/private
   sudo mkdir -p /etc/ssl/private
   sudo openssl req -newkey rsa:2048 -nodes -keyout /etc/ssl/private/selfsigned.key -x509 -out /etc/ssl/certs/selfsigned.crt

   ```

Вам нужно будет ввести информацию для сертификата, такую как страну, название организации и общее имя (это должно быть ваше доменное имя).

2. **Настройка Nginx для использования SSL:**

Теперь, когда у вас есть самоподписанный сертификат, вы можете обновить конфигурацию Nginx для использования SSL..

Отредактируйте файл `/etc/nginx/sites-available/default` чтобы он выглядел так: 

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
}```
```

##### **Вариант 2: Получение SSL сертификата от Let's Encrypt** (Рекомендуется для продакшн)

Если вы хотите использовать доверенный SSL сертификат, вы можете воспользоваться **Let's Encrypt,** который предоставляет бесплатные SSL сертификаты.

1. **Установите Certbot:**

Certbot — это инструмент, который автоматизирует процесс получения и обновления сертификатов от Let's Encrypt.

Установите Certbot и плагин для Nginx:

```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Получите SSL сертификат:**
   Выполните следующую команду для автоматического получения и установки SSL сертификата для вашего домена:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

Certbot автоматически настроит ваш сервер Nginx для использования нового сертификата. Вам нужно будет ввести ваш email адрес и согласиться с условиями использования.

3. **Автоматическое обновление SSL сертификата:**
  Сертификаты Let's Encrypt действуют 90 дней, поэтому нужно настроить автоматическое обновление. Certbot автоматически настроит cron задачу для этого. Для ручной проверки процесса обновления, выполните команду:
   ```
   sudo certbot renew --dry-run
  
   ``` 
4. **Обновление конфигурации Nginx для Let's Encrypt (по желанию):** Certbot автоматически обновит вашу конфигурацию Nginx для использования сертификатов Let's Encrypt, но если вам нужно вручную проверить конфигурацию, она должна выглядеть следующим образом:
``` nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

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
**Перезапустите Nginx для применения изменений:** 
```bash
sudo systemctl restart nginx
``` 
* Самоподписанные сертификаты рекомендуется использовать только для внутренних или тестовых целей, так как браузеры будут показывать предупреждения пользователям, которые заходят на сайт с самоподписанным сертификатом
* Let's Encrypt предоставляет доверенные SSL сертификаты, что настоятельно рекомендуется для сайтов в продакшн..


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

---

