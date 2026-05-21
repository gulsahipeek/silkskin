const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Statik dosyaları (görseller, assets vb.) dışarıya açıyoruz
app.use(express.static(path.join(__dirname)));

// Mac / XAMPP için yerel SQL bağlantı ayarları
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // XAMPP varsayılan kullanıcı adı
    password: '',      // XAMPP varsayılan şifre boştur
    database: 'silkskin_db'
});

db.connect((err) => {
    if (err) {
        console.error('SQL Bağlantı Hatası: ' + err.message);
        return;
    }
    console.log('SilkSkin SQL Veritabanına Başarıyla Bağlandı! ✨');
});

// 1. SQL'deki Yorumları Sitede Listelemek İçin Çeken API
app.get('/api/comments', (req, res) => {
    const sql = "SELECT name, message FROM messages ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. İletişim Formundan Gelen Mesajı SQL'e Kaydeden API
app.post('/api/comments', (req, res) => {
    const { name, email, message } = req.body;
    const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [name, email, message], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ status: 'success', message: 'Yorum SQL veri tabanına harfiyen kaydedildi!' });
    });
});

// Sunucuyu 3000 portunda başlatıyoruz
app.listen(3000, () => {
    console.log('SilkSkin Backend Motoru Aktif: http://localhost:3000');
});