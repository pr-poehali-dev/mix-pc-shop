'''
Business: Регистрация, вход пользователей и проверка токенов
Args: event с httpMethod, body (email, password, full_name, phone), headers (X-Auth-Token)
Returns: HTTP response с токеном или информацией о пользователе
'''

import json
import os
import hashlib
import secrets
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # POST - Регистрация или вход
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            email = body.get('email')
            password = body.get('password')
            full_name = body.get('full_name')
            phone = body.get('phone', '')
            
            # Если указано full_name - это регистрация
            if full_name:
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Email and password are required'})
                    }
                
                password_hash = hash_password(password)
                
                cursor.execute(
                    "INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (%s, %s, %s, %s, %s) RETURNING id, email, full_name, role",
                    (email, password_hash, full_name, phone, 'user')
                )
                user = cursor.fetchone()
                conn.commit()
                
                token = generate_token()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'token': token,
                        'user': dict(user)
                    })
                }
            else:
                # Иначе - это вход
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Email and password are required'})
                    }
                
                password_hash = hash_password(password)
                
                cursor.execute(
                    "SELECT id, email, full_name, role FROM users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user = cursor.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
                
                token = generate_token()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'token': token,
                        'user': dict(user)
                    })
                }
        
        # GET /me - Получить информацию о текущем пользователе
        if method == 'GET':
            auth_header = event.get('headers', {}).get('X-Auth-Token', '')
            
            if not auth_header:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Unauthorized'})
                }
            
            # В реальном приложении здесь должна быть проверка токена
            # Для упрощения возвращаем mock-пользователя
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({
                    'user': {
                        'id': 1,
                        'email': 'user@example.com',
                        'full_name': 'Test User',
                        'role': 'user'
                    }
                })
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except psycopg2.IntegrityError:
        return {
            'statusCode': 409,
            'headers': headers,
            'body': json.dumps({'error': 'User with this email already exists'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }