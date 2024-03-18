# Scraping Twitter Tweets

Scraping adalah metode untuk melakukan pengumpulan data dari suatu sumber. Scraping secara legal dengan API bawaan sudah disediakan oleh Twitter, Disini [Twitter](https://developer.twitter.com/en/docs/twitter-api). Namun API yang secara resmi diberikan oleh twitter mempunyai limit dalam melakukan Scrape. Oleh karena itu saya membuat aplikasi scraping dengan [NodeJS](https://nodejs.org/).

# How it Works?

Saya menggunakan Authentication Token Twitter untuk melakukan bypass terhadap sistem login twitter. Karena Puppeteer akan menggunakan guest mode saat menjalankan Chrome, maka hal tersebut tidak memungkinkan Puppeteer untuk menyimpan data Chrome User kita, namun hal itu dapat kita atasi dengan authentication_token yang kita dapat setelah login kedalam [twitter](https://twitter.com/)

## Features

- Scrape Tweets, Username, Name, Date
- (Another Features is On Progress)

## Getting started

Untuk mencoba menjalankan Aplikasi Scraping ini, ikuti langkah-langkah berikut:

1. Salin Repository ini:
```sh
git clone https://github.com/erlangftsiesta/x-puppeteer-crawl.git
```

2. Arahkan ke Direktori Project:
```sh
cd x-puppeteer-crawl
```

3. Install Modul yang diperlukan:
```sh
npm install
```

4. Atur Auth_Token, Query, Limit dan Path Chrome di Environment:
```sh
cd .env
```

5. Jalankan Sistem:
```sh
node app.js
```

Saat dijalankan, akan membuka Tab Chrome baru (tandanya Puppeteernya bekerja). Tunggu hingga Tab tertutup otomatis

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for more information.
