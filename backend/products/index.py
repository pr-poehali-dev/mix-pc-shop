'''
Business: API для работы с каталогом товаров (получение, фильтрация, поиск)
Args: event с httpMethod, queryStringParameters (category, brand, minPrice, maxPrice, search)
Returns: HTTP response со списком товаров или одним товаром
'''

import json
import os
from typing import Dict, Any, List
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
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # GET /products - Получить список товаров с фильтрами
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            
            category = params.get('category')
            brand = params.get('brand')
            min_price = params.get('minPrice')
            max_price = params.get('maxPrice')
            search = params.get('search')
            featured = params.get('featured')
            limit = int(params.get('limit', 50))
            offset = int(params.get('offset', 0))
            
            query = """
                SELECT p.*, c.name as category_name, b.name as brand_name
                FROM products p
                JOIN categories c ON p.category_id = c.id
                JOIN brands b ON p.brand_id = b.id
                WHERE 1=1
            """
            query_params = []
            
            if category:
                query += " AND c.slug = %s"
                query_params.append(category)
            
            if brand:
                query += " AND b.slug = %s"
                query_params.append(brand)
            
            if min_price:
                query += " AND p.price >= %s"
                query_params.append(float(min_price))
            
            if max_price:
                query += " AND p.price <= %s"
                query_params.append(float(max_price))
            
            if search:
                query += " AND (p.name ILIKE %s OR p.description ILIKE %s OR b.name ILIKE %s)"
                search_pattern = f"%{search}%"
                query_params.extend([search_pattern, search_pattern, search_pattern])
            
            if featured:
                query += " AND p.is_featured = true"
            
            query += " ORDER BY p.created_at DESC LIMIT %s OFFSET %s"
            query_params.extend([limit, offset])
            
            cursor.execute(query, tuple(query_params))
            products = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({
                    'products': [dict(p) for p in products],
                    'count': len(products)
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
