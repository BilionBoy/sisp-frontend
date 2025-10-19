interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class IndexedDBCache {
  private dbName = 'sisp-cache'
  private version = 1
  private db: IDBDatabase | null = null

  async init() {
    if (this.db) return this.db

    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains('ocorrencias')) {
          db.createObjectStore('ocorrencias', { keyPath: 'id_ocorrencia' })
        }

        if (!db.objectStoreNames.contains('tipos_crime')) {
          db.createObjectStore('tipos_crime', { keyPath: 'id_tipo_crime' })
        }

        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' })
        }
      }
    })
  }

  async set<T>(storeName: string, key: string, data: T, ttl: number = 10 * 60 * 1000) {
    await this.init()

    const entry: CacheEntry<T> & { key: string } = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    }

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(entry)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        const entry = request.result as (CacheEntry<T> & { key: string }) | undefined

        if (!entry) {
          resolve(null)
          return
        }

        if (Date.now() > entry.expiresAt) {
          this.delete(storeName, key)
          resolve(null)
          return
        }

        resolve(entry.data)
      }

      request.onerror = () => reject(request.error)
    })
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        const entries = request.result as Array<CacheEntry<T> & { key: string }>
        const now = Date.now()

        const valid = entries
          .filter(entry => now <= entry.expiresAt)
          .map(entry => entry.data)

        resolve(valid)
      }

      request.onerror = () => reject(request.error)
    })
  }

  async delete(storeName: string, key: string) {
    await this.init()

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clear(storeName: string) {
    await this.init()

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const cacheDB = new IndexedDBCache()
