

import pandas as pd
import psutil
import time

def get_network_features(interval=2):
    net1 = psutil.net_io_counters()
    time.sleep(interval)
    net2 = psutil.net_io_counters()

    return {
        "duration": interval,
        "src_bytes": net2.bytes_sent - net1.bytes_sent,
        "dst_bytes": net2.bytes_recv - net1.bytes_recv,
        "count": net2.packets_sent - net1.packets_sent,
        "srv_count": net2.packets_recv - net1.packets_recv,
    }


DATA_FILE = "live_network_data.csv"

def get_stats(interval=2):
    net1 = psutil.net_io_counters()
    time.sleep(interval)
    net2 = psutil.net_io_counters()

    return {
        "duration": interval,
        "src_bytes": net2.bytes_sent - net1.bytes_sent,
        "dst_bytes": net2.bytes_recv - net1.bytes_recv,
        "count": net2.packets_sent - net1.packets_sent,
        "srv_count": net2.packets_recv - net1.packets_recv,
    }

def collect_data(samples=500):
    data = []

    print("Collecting live network data...")
    for i in range(samples):
        row = get_stats()
        data.append(row)
        print(f"Sample {i+1}: {row}")

    df = pd.DataFrame(data)
    df.to_csv(DATA_FILE, index=False)
    print(f"\nSaved {samples} samples to {DATA_FILE}")

if __name__ == "__main__":
    collect_data(samples=500)
