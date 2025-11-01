import { Queue, Worker, QueueScheduler, JobsOptions } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const connection = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const queueName = 'price-updates';

const queue = new Queue(queueName, { connection: { url: connection } });
const scheduler = new QueueScheduler(queueName, { connection: { url: connection } });

const worker = new Worker(queueName, async (job) => {
  console.log('Processing job', job.name, job.id, job.data);
}, { connection: { url: connection } });

worker.on('completed', (job) => console.log('Job completed', job.id));
worker.on('failed', (job, err) => console.error('Job failed', job?.id, err));

async function enqueueDemo() {
  const opts: JobsOptions = { removeOnComplete: true, removeOnFail: true };
  await queue.add('demo', { at: new Date().toISOString() }, opts);
}

enqueueDemo().catch(console.error);

