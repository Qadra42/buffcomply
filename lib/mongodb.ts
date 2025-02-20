import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usa una variable global para mantener la conexión viva
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En producción, es mejor crear una nueva conexión
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToMongoDB() {
  const client = await clientPromise
  return client.db('scraper_db') // Asegúrate de que este nombre coincida con tu base de datos
} 