What is a Thread?

Threads are created by the process to run multiple tasks like playing video, downloading, etc. parellaly. One process can only run in one core. although a process can start many sub processes to run different tasks parellaly. but spawning a process takes time beacuse every process has its own memory.

But threads takes parent process memory. creating a thread is very fast compared to process. Before this main process run a task one at a time. means if we are playing a video and downloading then we can either play a video or download at one time.

Threads created by process runs in different cores in processor simultaneously allwoing us to perform different tasks together.

But what will happen if processor have one core. If we do not create thread and let process execute all tasks, then process will complete running one task first then it will run second task. means if we are playing video then the whole video will first downlaod completely in lets take about 10s and then it will buffer and load in lets take about 10s. then overall 20s will take to run one task. We need to wait for 20s to watch a video.

In threads it will also take 20s to run same task. but it will not download completely and load completely. one thread will download for some Mbs then other thread will load downloaded Mbs and we can watch 1s clip, while we are watching, it will download and load some MB until task completely executed. Means we are able to download file and watch it at same time. This is possible beacuse of threads.

If we have multiple cores then threads will take less time to execute task because every thread run on different core simultaneously. But with only process even if we have multiple cores a process will run on one core menas it will take more time.