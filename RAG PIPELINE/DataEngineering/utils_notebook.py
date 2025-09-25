import os
import pandas as pd
import numpy as np
from datetime import datetime
import netCDF4 as nc
from pathlib import Path

def get_current_date_parts():
    """Get current year, month, day"""
    now = datetime.now()
    return now.year, now.month, now.day

def build_input_path(base_folder, year, month, folder_name):
    """Build input path for data files"""
    return os.path.join(base_folder, str(year), str(month).zfill(2), folder_name)

def build_output_path(base_folder, year, month, folder_name):
    """Build output path for processed files"""
    output_dir = os.path.join(base_folder, str(year), str(month).zfill(2), folder_name)
    os.makedirs(output_dir, exist_ok=True)
    return output_dir

def save_dataframe(df, output_path, filename, file_format='parquet'):
    """Save dataframe to specified format"""
    os.makedirs(output_path, exist_ok=True)

    if file_format == 'parquet':
        df.to_parquet(os.path.join(output_path, f"cleaned_{filename}.parquet"), index=False)
    elif file_format == 'csv':
        df.to_csv(os.path.join(output_path, f"cleaned_{filename}.csv"), index=False)
    else:
        raise ValueError(f"Unsupported file format: {file_format}")

    print(f"[INFO] Saved {len(df)} records to {output_path}")

def process_internal_folder(input_path, variable, date_parts, folder_name):
    """Process NetCDF files in a folder"""
    df_list = []

    if not os.path.exists(input_path):
        print(f"[WARN] Input path does not exist: {input_path}")
        return pd.DataFrame()

    try:
        # Find all .nc files in the input path
        nc_files = list(Path(input_path).rglob("*.nc"))

        if not nc_files:
            print(f"[WARN] No NetCDF files found in {input_path}")
            return pd.DataFrame()

        for nc_file in nc_files:
            try:
                print(f"[INFO] Processing {nc_file}")
                with nc.Dataset(nc_file, 'r') as dataset:
                    # Extract coordinates
                    if 'lat' in dataset.variables and 'lon' in dataset.variables:
                        lat = dataset.variables['lat'][:]
                        lon = dataset.variables['lon'][:]

                        # Handle different grid structures
                        if lat.ndim == 1 and lon.ndim == 1:
                            lon_grid, lat_grid = np.meshgrid(lon, lat)
                        elif lat.ndim == 2 and lon.ndim == 2:
                            lat_grid, lon_grid = lat, lon
                        else:
                            print(f"[WARN] Unexpected lat/lon dimensions in {nc_file}")
                            continue

                        # Extract variable data
                        if variable in dataset.variables:
                            var_data = dataset.variables[variable][:]

                            # Flatten grids and create dataframe
                            df_temp = pd.DataFrame({
                                'lat': lat_grid.flatten(),
                                'lon': lon_grid.flatten(),
                                'year': date_parts['year'],
                                'month': date_parts['month'],
                                'day': date_parts['day'],
                                variable: var_data.flatten()
                            })

                            # Remove NaN values
                            df_temp = df_temp.dropna()
                            df_list.append(df_temp)

                        else:
                            print(f"[WARN] Variable {variable} not found in {nc_file}")

            except Exception as e:
                print(f"[ERROR] Error processing {nc_file}: {str(e)}")
                continue

        if df_list:
            return pd.concat(df_list, ignore_index=True)
        else:
            return pd.DataFrame()

    except Exception as e:
        print(f"[ERROR] Error processing folder {input_path}: {str(e)}")
        return pd.DataFrame()

def validate_dataframe(df, required_columns):
    """Validate dataframe structure"""
    if df is None or df.empty:
        return False, "DataFrame is empty"

    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        return False, f"Missing columns: {missing_columns}"

    return True, "Validation passed"
