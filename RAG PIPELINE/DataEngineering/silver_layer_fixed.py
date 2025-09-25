# Silver Layer

# Bronze to Silver ETL pipeline.
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils_notebook import get_current_date_parts, build_input_path, build_output_path, save_dataframe, process_internal_folder

from config import SLIVER_CONFIG, BRONZE_LAYER, SILVER_LAYER

def process_and_save_netcdf(base_folder, config, final_output_path, file_format='parquet'):
    year, month, day = get_current_date_parts()

    date_parts = {'year': year, 'month': month, 'day': day}

    for folder_name, variable in config.items():
        input_path = build_input_path(base_folder, year, month, folder_name)

        df = process_internal_folder(input_path, variable, date_parts, folder_name)

        if not df.empty:
            output_path = build_output_path(final_output_path, year, month, folder_name)

            save_dataframe(df, output_path, folder_name, file_format)
        else:
            print(f"[INFO] No data for {folder_name}")

# Uncomment to run the pipeline
# process_and_save_netcdf(BRONZE_LAYER, SLIVER_CONFIG, SILVER_LAYER, 'parquet')
