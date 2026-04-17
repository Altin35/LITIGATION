import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import multer from 'multer';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'litigation.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

async function ensureDirs() {
  await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

async function startServer() {
  await ensureDirs();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(UPLOAD_DIR));

  // --- API Routes ---

  // Get all litigation records
  app.get('/api/litigation', async (req, res) => {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: 'Failed to read data' });
    }
  });

  // Search litigation by survey number
  app.get('/api/litigation/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json([]);
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      const records = JSON.parse(data);
      const filtered = records.filter((r: any) => 
        r.surveyNumber.toString().toLowerCase().includes(query.toString().toLowerCase())
      );
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search data' });
    }
  });

  // Add new litigation
  app.post('/api/litigation', upload.single('document'), async (req: any, res) => {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      const records = JSON.parse(data);
      const newRecord = {
        id: Date.now().toString(),
        ...req.body,
        documentUrl: req.file ? `/uploads/${req.file.filename}` : null,
        createdDate: new Date().toISOString()
      };
      records.push(newRecord);
      await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2));
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add record' });
    }
  });

  // Update litigation
  app.put('/api/litigation/:id', upload.single('document'), async (req: any, res) => {
    try {
      const { id } = req.params;
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      let records = JSON.parse(data);
      const index = records.findIndex((r: any) => r.id === id);
      if (index === -1) return res.status(404).json({ error: 'Record not found' });

      const updatedRecord = {
        ...records[index],
        ...req.body,
        documentUrl: req.file ? `/uploads/${req.file.filename}` : records[index].documentUrl,
        updatedDate: new Date().toISOString()
      };
      records[index] = updatedRecord;
      await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2));
      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update record' });
    }
  });

  // Delete litigation
  app.delete('/api/litigation/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      let records = JSON.parse(data);
      records = records.filter((r: any) => r.id !== id);
      await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete record' });
    }
  });

  // --- Vite Middleware ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
