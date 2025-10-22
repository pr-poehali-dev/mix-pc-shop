'''
Business: Админ-панель для управления товарами (CRUD операции)
Args: event с httpMethod, body (product data), headers (X-Auth-Token)
Returns: HTTP response с результатом операции
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    # Проверка токена администратора (упрощенная версия)
    auth_token = event.get('headers', {}).get('X-Auth-Token', '')
    if not auth_token:
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # POST /products - Создать товар
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            required_fields = ['category_id', 'brand_id', 'name', 'slug', 'price']
            for field in required_fields:
                if field not in body:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': f'Field {field} is required'})
                    }
            
            cursor.execute("""
                INSERT INTO products 
                (category_id, brand_id, name, slug, description, price, old_price, stock_quantity, image_url, is_featured)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
                body['category_id'],
                body['brand_id'],
                body['name'],
                body['slug'],
                body.get('description', ''),
                body['price'],
                body.get('old_price'),
                body.get('stock_quantity', 0),
                body.get('image_url', ''),
                body.get('is_featured', False)
            ))
            
            product = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'product': dict(product)}, default=str)
            }
        
        # PUT /products/:id - Обновить товар
        if method == 'PUT':
            product_id = event.get('pathParams', {}).get('id')
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Product ID is required'})
                }
            
            body = json.loads(event.get('body', '{}'))
            
            cursor.execute("""
                UPDATE products 
                SET name = %s, description = %s, price = %s, old_price = %s, 
                    stock_quantity = %s, image_url = %s, is_featured = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            """, (
                body.get('name'),
                body.get('description'),
                body.get('price'),
                body.get('old_price'),
                body.get('stock_quantity'),
                body.get('image_url'),
                body.get('is_featured'),
                product_id
            ))
            
            product = cursor.fetchone()
            conn.commit()
            
            if not product:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Product not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'product': dict(product)}, default=str)
            }
        
        # GET - Получить категории или бренды
        if method == 'GET':
            cursor.execute("SELECT * FROM categories ORDER BY name")
            categories = cursor.fetchall()
            cursor.execute("SELECT * FROM brands ORDER BY name")
            brands = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({
                    'categories': [dict(c) for c in categories],
                    'brands': [dict(b) for b in brands]
                }, default=str)
            }
        
        cursor.close()
        conn.close()
        
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