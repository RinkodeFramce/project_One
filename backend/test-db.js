const pool = require('./config/database');

async function testConnection() {
    try {
        // Тест подключения
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL');

        // Создание таблиц
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Users table created or already exists');

        await client.query(`
            CREATE TABLE IF NOT EXISTS clients (
                id SERIAL PRIMARY KEY,
                inn VARCHAR(12) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Clients table created or already exists');

        // Добавление тестовых данных
        await client.query(`
            INSERT INTO clients (inn, name) VALUES
                ('1234567890', 'ООО "Первая компания"'),
                ('0987654321', 'ИП Иванов А.А.'),
                ('1111111111', 'ООО "Тестовая фирма"')
            ON CONFLICT (inn) DO NOTHING;
        `);
        console.log('Test clients added');

        // Проверка данных
        const result = await client.query('SELECT * FROM clients');
        console.log('Current clients in database:', result.rows);

        client.release();
    } catch (err) {
        console.error('Database test error:', err);
    } finally {
        // Закрываем пул соединений
        await pool.end();
    }
}

testConnection(); 