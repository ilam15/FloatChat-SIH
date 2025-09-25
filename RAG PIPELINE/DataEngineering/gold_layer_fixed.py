# Gold Layer

# Silver to Gold merge pipeline.
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pandas as pd

from utils_notebook import get_current_date_parts, save_dataframe

from config import SLIVER_CONFIG, SILVER_LAYER, GOLD_LAYER

def merge_silver_to_gold(silver_layer, config, gold_layer, file_format='parquet'):
    os.makedirs(gold_layer, exist_ok=True)

    df_main = None

    year, month, day = get_current_date_parts()

    for folder, var in config.items():
        parquet_path = os.path.join(silver_layer, str(year), str(month).zfill(2), folder, f"cleaned_{folder}.parquet")

        if not os.path.exists(parquet_path):
            print(f"[WARN] Missing {parquet_path}")
            continue

        print(f"[INFO] Reading Silver data for {folder}")

        df_temp = pd.read_parquet(parquet_path)[['lat','lon','year','month',var]]

        df_main = df_temp if df_main is None else df_main.merge(df_temp, on=['lat','lon','year','month'], how='outer')

        print(f"[INFO] Current data shape: {df_main.shape}")

    if df_main is not None:
        required_cols = list(config.values())
        df_final = df_main.dropna(subset=required_cols)

        print(f"[INFO] Final data shape after dropping NaNs: {df_final.shape}")

        save_dataframe(df_final, gold_layer, "merged_gold", file_format)
        print(f"[SUCCESS] Gold layer created with {len(df_final)} records")
    else:
        print("[ERROR] No data found to merge")

# Uncomment to run the pipeline
# merge_silver_to_gold(SILVER_LAYER, SLIVER_CONFIG, GOLD_LAYER, 'parquet')
