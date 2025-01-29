import threading
import time
import queue

class Worker(threading.Thread):
    def __init__(self, task_queue):
        super().__init__()
        self.task_queue = task_queue
        self.daemon = True  # Ensures the thread exits when the main program exits

    def run(self):
        while True:
            try:
                task = self.task_queue.get(timeout=3)  # Wait for a task
                print(f"Processing task: {task}")
                time.sleep(1)  # Simulating work
                self.task_queue.task_done()
            except queue.Empty:
                print("No tasks available, worker exiting.")
                break  # Exit when no tasks are left

class ThreadPool:
    def __init__(self, num_workers):
        self.task_queue = queue.Queue()
        self.workers = [Worker(self.task_queue) for _ in range(num_workers)]

    def add_task(self, task):
        self.task_queue.put(task)

    def start(self):
        for worker in self.workers:
            worker.start()

    def wait_for_completion(self):
        self.task_queue.join()  # Wait for all tasks to complete

# Simulating workload
def main():
    num_threads = 5
    pool = ThreadPool(num_threads)

    for i in range(10):
        pool.add_task(f"Task-{i}")

    pool.start()
    pool.wait_for_completion()
    print("All tasks completed.")

if __name__ == "__main__":
    main()
