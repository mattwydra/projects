import sqlite3

def create_database():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()

    # Users Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    ''')

    # Games Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS Games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    )
    ''')

    # GameScores Table
    c.execute('''
    CREATE TABLE IF NOT EXISTS GameScores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users (id),
        FOREIGN KEY (game_id) REFERENCES Games (id)
    )
    ''')

    conn.commit()
    conn.close()
