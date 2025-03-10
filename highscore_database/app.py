from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_cors import CORS
import sqlite3
import os
import hashlib
import secrets
import datetime
import json

app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(16)

# Database setup
DB_PATH = 'minigames.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DB_PATH):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            nickname TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Create scores table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            game_name TEXT NOT NULL,
            game_mode TEXT,
            score REAL NOT NULL,
            reaction_time REAL,
            accuracy REAL,
            time_survived REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        ''')
        
        conn.commit()
        conn.close()

# Initialize database on startup
init_db()

# Helper functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(stored_hash, provided_password):
    return stored_hash == hash_password(provided_password)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

# User Authentication Routes
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username')
        password = data.get('password')
        nickname = data.get('nickname', '')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        conn = get_db_connection()
        try:
            conn.execute('INSERT INTO users (username, password_hash, nickname) VALUES (?, ?, ?)',
                        (username, hash_password(password), nickname))
            conn.commit()
            
            if request.is_json:
                return jsonify({'success': True, 'message': 'Registration successful'})
            else:
                return redirect(url_for('login'))
                
        except sqlite3.IntegrityError:
            if request.is_json:
                return jsonify({'error': 'Username already exists'}), 400
            else:
                return render_template('register.html', error='Username already exists')
        finally:
            conn.close()
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()
        
        if user and verify_password(user['password_hash'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            
            if request.is_json:
                return jsonify({'success': True, 'user_id': user['id'], 'username': user['username']})
            else:
                return redirect(url_for('dashboard'))
        else:
            if request.is_json:
                return jsonify({'error': 'Invalid credentials'}), 401
            else:
                return render_template('login.html', error='Invalid credentials')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (session['user_id'],)).fetchone()
    
    # Get user's high scores for each game
    scores = conn.execute('''
    SELECT s1.* 
    FROM scores s1
    JOIN (
        SELECT game_name, game_mode, MAX(score) as max_score
        FROM scores
        WHERE user_id = ?
        GROUP BY game_name, game_mode
    ) s2
    ON s1.game_name = s2.game_name 
    AND s1.game_mode = s2.game_mode
    AND s1.score = s2.max_score
    WHERE s1.user_id = ?
    ORDER BY s1.game_name, s1.game_mode, s1.created_at DESC
    ''', (session['user_id'], session['user_id'])).fetchall()
    
    conn.close()
    return render_template('dashboard.html', user=user, scores=scores)

# API Routes
@app.route('/api/save_score', methods=['POST'])
def save_score():
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    
    data = request.get_json()
    user_id = data.get('user_id')
    game_name = data.get('game_name')
    game_mode = data.get('game_mode', '')
    score = data.get('score')
    
    if not user_id or not game_name or score is None:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Optional fields
    reaction_time = data.get('reaction_time')
    accuracy = data.get('accuracy')
    time_survived = data.get('time_survived')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
        INSERT INTO scores 
        (user_id, game_name, game_mode, score, reaction_time, accuracy, time_survived, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, game_name, game_mode, score, reaction_time, accuracy, time_survived, 
             datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
        
        conn.commit()
        
        # Check if this is a new high score
        user_high_score = conn.execute('''
        SELECT MAX(score) as high_score 
        FROM scores 
        WHERE user_id = ? AND game_name = ? AND game_mode = ?
        ''', (user_id, game_name, game_mode)).fetchone()
        
        is_high_score = user_high_score and user_high_score['high_score'] == score
        
        return jsonify({
            'success': True, 
            'score_id': cursor.lastrowid,
            'is_high_score': is_high_score
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/get_user_scores/<int:user_id>')
def get_user_scores(user_id):
    conn = get_db_connection()
    scores = conn.execute('''
    SELECT game_name, game_mode, score, reaction_time, accuracy, time_survived, created_at
    FROM scores
    WHERE user_id = ?
    ORDER BY created_at DESC
    ''', (user_id,)).fetchall()
    
    conn.close()
    
    scores_list = [{
        'game_name': row['game_name'],
        'game_mode': row['game_mode'],
        'score': row['score'],
        'reaction_time': row['reaction_time'],
        'accuracy': row['accuracy'],
        'time_survived': row['time_survived'],
        'created_at': row['created_at']
    } for row in scores]
    
    return jsonify(scores_list)

@app.route('/api/get_user_high_scores/<int:user_id>')
def get_user_high_scores(user_id):
    conn = get_db_connection()
    scores = conn.execute('''
    SELECT s1.* 
    FROM scores s1
    JOIN (
        SELECT game_name, game_mode, MAX(score) as max_score
        FROM scores
        WHERE user_id = ?
        GROUP BY game_name, game_mode
    ) s2
    ON s1.game_name = s2.game_name 
    AND s1.game_mode = s2.game_mode
    AND s1.score = s2.max_score
    WHERE s1.user_id = ?
    ORDER BY s1.game_name, s1.game_mode
    ''', (user_id, user_id)).fetchall()
    
    conn.close()
    
    scores_list = [{
        'game_name': row['game_name'],
        'game_mode': row['game_mode'],
        'score': row['score'],
        'reaction_time': row['reaction_time'],
        'accuracy': row['accuracy'],
        'time_survived': row['time_survived'],
        'created_at': row['created_at']
    } for row in scores]
    
    return jsonify(scores_list)

@app.route('/api/get_leaderboard/<game_name>')
def get_leaderboard(game_name):
    game_mode = request.args.get('game_mode', '')
    limit = request.args.get('limit', 10, type=int)
    
    conn = get_db_connection()
    
    if game_mode:
        leaderboard = conn.execute('''
        SELECT s.*, u.username, u.nickname
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.game_name = ? AND s.game_mode = ?
        ORDER BY s.score DESC
        LIMIT ?
        ''', (game_name, game_mode, limit)).fetchall()
    else:
        leaderboard = conn.execute('''
        SELECT s.*, u.username, u.nickname
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.game_name = ?
        ORDER BY s.score DESC
        LIMIT ?
        ''', (game_name, limit)).fetchall()
    
    conn.close()
    
    leaderboard_list = [{
        'username': row['username'],
        'nickname': row['nickname'],
        'score': row['score'],
        'reaction_time': row['reaction_time'],
        'accuracy': row['accuracy'],
        'time_survived': row['time_survived'],
        'created_at': row['created_at']
    } for row in leaderboard]
    
    return jsonify(leaderboard_list)

@app.route('/api/get_user_progress/<int:user_id>/<game_name>')
def get_user_progress(user_id, game_name):
    game_mode = request.args.get('game_mode', '')
    limit = request.args.get('limit', 20, type=int)
    
    conn = get_db_connection()
    
    if game_mode:
        scores = conn.execute('''
        SELECT score, reaction_time, accuracy, time_survived, created_at
        FROM scores
        WHERE user_id = ? AND game_name = ? AND game_mode = ?
        ORDER BY created_at
        LIMIT ?
        ''', (user_id, game_name, game_mode, limit)).fetchall()
    else:
        scores = conn.execute('''
        SELECT score, game_mode, reaction_time, accuracy, time_survived, created_at
        FROM scores
        WHERE user_id = ? AND game_name = ?
        ORDER BY created_at
        LIMIT ?
        ''', (user_id, game_name, limit)).fetchall()
    
    conn.close()
    
    scores_list = [{
        'score': row['score'],
        'game_mode': row.get('game_mode', game_mode),
        'reaction_time': row['reaction_time'],
        'accuracy': row['accuracy'],
        'time_survived': row['time_survived'],
        'created_at': row['created_at']
    } for row in scores]
    
    return jsonify(scores_list)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)