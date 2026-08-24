import { describe, expect, it } from "vitest";
import { Mutex } from "../../src/lock/mutex";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Mutex", () => {
  it("acquire() resolves immediately when nobody holds the lock", async () => {
    const mutex = new Mutex();
    await mutex.acquire();
    expect(() => mutex.release()).not.toThrow();
  });

  it("a second acquire() does not resolve until release() is called", async () => {
    const mutex = new Mutex();
    const order: string[] = [];

    await mutex.acquire();
    order.push("A-acquired");

    const bPromise = (async () => {
      await mutex.acquire();
      order.push("B-acquired");
      mutex.release();
    })();

    await sleep(10);
    order.push("before-A-release");

    mutex.release();
    await bPromise;

    expect(order).toEqual(["A-acquired", "before-A-release", "B-acquired"])
  });

  it("wakes up multiple waiters in FIFO order", async () => {
    const mutex = new Mutex();
    const order: number[] = [];

    await mutex.acquire();

    const aPromise = (async () => {
      await mutex.acquire();
      order.push(1);
      mutex.release();
    })();

    const bPromise = (async () => {
      await mutex.acquire();
      order.push(2);
      mutex.release();
    })();

    const cPromise = (async () => {
      await mutex.acquire();
      order.push(3);
      mutex.release();
    })();

    mutex.release();
    await aPromise;
    await bPromise;
    await cPromise;

    expect(order).toEqual([1, 2, 3])
  });
});
