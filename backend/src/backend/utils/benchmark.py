import time

benchmarks = {}

def benchmark_start(label: str):
    benchmarks[label] = time.perf_counter()
    
def benchmark_end(label: str, should_print: bool = True):
    if not benchmarks[label]:
        return
    
    elapsed = (time.perf_counter() - benchmarks[label]) * 1000
    
    if should_print:
        if elapsed >= 1000:
            print(f"{label} -> {elapsed / 1000:.2f}s")
        else:
            print(f"{label} -> {elapsed:.2f}ms")
            
    del benchmarks[label]