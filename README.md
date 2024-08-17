# core1 [![Laravel Test](https://github.com/freight-capstone/core1/actions/workflows/php.yml/badge.svg)](https://github.com/freight-capstone/core1/actions/workflows/php.yml) [![Lint](https://github.com/freight-capstone/core1/actions/workflows/lint.yml/badge.svg)](https://github.com/freight-capstone/core1/actions/workflows/lint.yml)
Freight Management System: End-to-End Freight Order Management: Streamlining the Freight Lifecycle from Creation to Delivery

## Pre-requisites
- XAMPP or mysql cli
- Node.js v20.^
- PHP v8.2.^
- Laravel v11.^ & Composer
  
## Setting up
- install dependecies
  ```
  composer install && npm install
  ```
- create environment
  ```
  cp .env.example .env
  ```
- generate app key
  ```
  php artisan key:generate
  ```
- launch xampp & start mysql
  > or use the mysql cmd line interface
- database migration
  ```
  php artisan migrate
  php artisan db:seed
  ```

## Start application
- start vite
  ```
  npm run dev
  ```
- start laravel
  ```sh
  php artisan serve
  ```

## Refresh migration
```
  php artisan migrate:refresh
  php artisan db:seed
```

## Refresh cache
```
  php artisan config:cache
```

## Test Deployment
```sh
  php artisan test

  # use apache not php artisan serve
  # configure it on var/www

  # bundle the resources
  npm run build
```