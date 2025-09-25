# Main Pipeline Runner

# Pipeline runner for Bronze → Silver → Gold.
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from silver_layer_fixed import process_and_save_netcdf
from gold_layer_fixed import merge_silver_to_gold

# Configuration with fallback
try:
    from config import SLIVER_CONFIG, BRONZE_LAYER, SILVER_LAYER, GOLD_LAYER
except ImportError:
    # Fallback configuration if config.ipynb can't be imported
    SLIVER_CONFIG = {
        'sst': 'sst',
        'poc': 'poc',
        'pic': 'pic',
        'aot': 'aot_862',
        'Chlorophyll': 'chlor_a',
        'Kd490': 'Kd_490'
    }

    PROJECT_ROOT = '.'
    BRONZE_LAYER = os.path.join(PROJECT_ROOT, 'Bronze_Data')
    SILVER_LAYER = os.path.join(PROJECT_ROOT, 'Silver_Data')
    GOLD_LAYER = os.path.join(PROJECT_ROOT, 'Gold_Data')

def run_pipeline():
    print("Starting Data Engineering Pipeline...")
    print("=" * 50)

    try:
        print("Step 1: Bronze → Silver...")
        process_and_save_netcdf(BRONZE_LAYER, SLIVER_CONFIG, SILVER_LAYER, 'parquet')
        print("Bronze → Silver completed successfully.\n")

        print("Step 2: Silver → Gold...")
        merge_silver_to_gold(SILVER_LAYER, SLIVER_CONFIG, GOLD_LAYER, 'parquet')
        print("Silver → Gold completed successfully.\n")

        print("=" * 50)
        print("Pipeline completed successfully!")

    except Exception as e:
        print(f"[ERROR] Pipeline failed: {str(e)}")
        raise

if __name__ == "__main__":
    run_pipeline()
