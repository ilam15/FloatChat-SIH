# Configuration file for pipeline
import os

PROJECT_ROOT = '.'

SLIVER_CONFIG = {
    'sst': 'sst',
    'poc': 'poc',
    'pic': 'pic',
    'aot': 'aot_862',
    'Chlorophyll': 'chlor_a',
    'Kd490': 'Kd_490'
}

BRONZE_LAYER = os.path.join(PROJECT_ROOT, 'Bronze_Data')
SILVER_LAYER = os.path.join(PROJECT_ROOT, 'Silver_Data')
GOLD_LAYER = os.path.join(PROJECT_ROOT, 'Gold_Data')

POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "sama1234"
POSTGRES_HOST = "localhost"
POSTGRES_PORT = "5432"
POSTGRES_DB = "SIH"
TABLE_NAME = "agro_kpi"
