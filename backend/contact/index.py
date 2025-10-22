'''
Business: Форма обратной связи для вопросов пользователей
Args: event с httpMethod, body (name, email, phone, subject, message)
Returns: HTTP response с подтверждением отправки
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get('DATABASE_URL')

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            name = body.get('name')
            email = body.get('email')
            message = body.get('message')
            
            if not name or not email or not message:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Name, email and message are required'})
                }
            
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO contact_messages (name, email, phone, subject, message, status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, created_at
            """, (
                name,
                email,
                body.get('phone', ''),
                body.get('subject', ''),
                message,
                'new'
            ))
            
            result = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'Your message has been sent successfully',
                    'id': result['id']
                }, default=str)
            }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
