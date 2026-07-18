import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom Vite Plugin for Local Development Uploads
function localUploaderPlugin() {
  return {
    name: 'local-uploader',
    configureServer(server) {
      // Add a custom middleware to intercept /api/local-upload
      server.middlewares.use('/api/local-upload', (req, res, next) => {
        if (req.method !== 'POST') return next()
        
        // Express has a default body size limit, but Connect middleware (Vite)
        // just streams data. We must buffer it ourselves.
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        
        req.on('end', () => {
          try {
            const bodyStr = Buffer.concat(chunks).toString('utf8')
            const data = JSON.parse(bodyStr)
            
            // Ensure public/models directory exists
            const modelsDir = path.resolve(__dirname, 'public/models')
            if (!fs.existsSync(modelsDir)) {
              fs.mkdirSync(modelsDir, { recursive: true })
            }

            const modelId = 'm' + Date.now()
            let rawUrl = ''
            let glbUrl = ''
            let thumbnailUrl = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80'

            // Save STEP/Raw File if provided
            if (data.stepFile && data.stepFile.content) {
              // Extract extension from filename (e.g. .step)
              const ext = path.extname(data.stepFile.name) || '.step'
              const fileName = `${modelId}_raw${ext}`
              // Convert base64 back to binary and save
              fs.writeFileSync(
                path.join(modelsDir, fileName),
                Buffer.from(data.stepFile.content, 'base64')
              )
              rawUrl = `/models/${fileName}` // Access path via public folder
            }

            // Save GLB File if provided
            if (data.glbFile && data.glbFile.content) {
              const fileName = `${modelId}_web.glb`
              fs.writeFileSync(
                path.join(modelsDir, fileName),
                Buffer.from(data.glbFile.content, 'base64')
              )
              glbUrl = `/models/${fileName}`
            }

            // Save Thumbnail File if provided
            if (data.thumbFile && data.thumbFile.content) {
              const ext = path.extname(data.thumbFile.name) || '.png'
              const fileName = `${modelId}_thumb${ext}`
              fs.writeFileSync(
                path.join(modelsDir, fileName),
                Buffer.from(data.thumbFile.content, 'base64')
              )
              thumbnailUrl = `/models/${fileName}`
            }

            // Append new model entry directly into src/data/mockData.js
            const mockDataPath = path.resolve(__dirname, 'src/data/mockData.js')
            let mockDataContent = fs.readFileSync(mockDataPath, 'utf8')
            
            const newModelEntry = `\n  {
    id: '${modelId}',
    name: '${data.name}',
    teamNumber: '${data.teamNumber}',
    teamName: 'Team ${data.teamNumber}',
    downloads: 0,
    uploadDate: '${new Date().toISOString().split('T')[0]}',
    thumbnail: '${thumbnailUrl}',
    categories: ${JSON.stringify(data.categories || [])},
    features: ${JSON.stringify(data.features || [])},
    rawUrl: '${rawUrl}',
    glbUrl: '${glbUrl}'
  },`
            
            // Inject new model at the top of the array
            mockDataContent = mockDataContent.replace('export const mockModels = [', `export const mockModels = [${newModelEntry}`)
            fs.writeFileSync(mockDataPath, mockDataContent)

            // Respond success
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, id: modelId, rawUrl, glbUrl }))
            console.log(`\n[Vite Plugin] Successfully saved model ${data.name} to local files!`)
            
          } catch (e) {
            console.error('[Vite Plugin Error]', e)
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), localUploaderPlugin()],
})
