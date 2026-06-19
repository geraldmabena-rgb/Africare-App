import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const port = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Server-side API proxy for Gemini to keep secrets secure
  app.post('/api/gemini/generate', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'GEMINI_API_KEY is not configured. Please supply it via Settings > Secrets.' 
        });
      }

      // Initialize GoogleGenAI SDK as instructed by the gemini-api skill
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const { prompt, config } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      // Default the model to 'gemini-3.5-flash' for basic text/code generation tasks
      const modelName = req.body.model || 'gemini-3.5-flash';

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: config || {},
      });

      const generatedText = response.text || '';
      return res.json({ text: generatedText });
    } catch (error: any) {
      console.error('Gemini SDK Error:', error);
      return res.status(500).json({ 
        error: error.message || 'An error occurred during Gemini generation.' 
      });
    }
  });

  // User feedback database file path
  const FEEDBACK_FILE = path.resolve(process.cwd(), 'feedback.json');

  // Helper to read feedbacks
  async function readFeedbacks() {
    try {
      const data = await fs.readFile(FEEDBACK_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // Return empty array if file does not exist yet
        return [];
      }
      console.error('Failed to read feedback file:', error);
      return [];
    }
  }

  // Helper to write feedbacks
  async function writeFeedbacks(feedbacks: any[]) {
    try {
      await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to write feedback file:', error);
    }
  }

  // API Endpoint to store user session feedback
  app.post('/api/feedback', async (req, res) => {
    try {
      const { triageId, userId, rating, comment, severityLevel, userCityOrRegion } = req.body;

      if (!triageId) {
        return res.status(400).json({ error: 'Triage Session ID (triageId) is required.' });
      }
      if (!userId) {
        return res.status(400).json({ error: 'User ID (userId) is required.' });
      }
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
      }

      const feedbacks = await readFeedbacks();
      
      const newFeedback = {
        id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        triageId,
        userId,
        rating,
        comment: comment || '',
        timestamp: new Date().toISOString(),
        severityLevel: severityLevel || 'unknown',
        userCityOrRegion: userCityOrRegion || 'Harare'
      };

      feedbacks.push(newFeedback);
      await writeFeedbacks(feedbacks);

      console.log(`[Feedback Saved] Session ${triageId}, User ${userId}, Rating: ${rating}`);
      return res.json({ success: true, feedback: newFeedback });
    } catch (error: any) {
      console.error('Error storing feedback:', error);
      return res.status(500).json({ error: 'Failed to write session feedback.' });
    }
  });

  // API Endpoint to load all feedback (for developers / clinicians to review for analysis)
  app.get('/api/feedback', async (req, res) => {
    try {
      const feedbacks = await readFeedbacks();
      return res.json(feedbacks);
    } catch (error: any) {
      console.error('Error fetching feedbacks:', error);
      res.status(500).json({ error: 'Failed to fetch medical feedbacks.' });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  const rootDir = process.cwd();

  if (!isProd) {
    // Development Middleware
    console.log('Running in DEVELOPMENT mode. Starting Vite dev server...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await fs.readFile(path.resolve(rootDir, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production Middleware
    console.log('Running in PRODUCTION mode. Serving pre-compiled assets...');
    const distPath = path.resolve(rootDir, 'dist');
    
    // Serve static files from compiled dist
    app.use(express.static(distPath));

    app.all('*', async (req, res) => {
      try {
        const template = await fs.readFile(path.resolve(distPath, 'index.html'), 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (error) {
        res.status(500).send('Production index.html missing or unreadable. Make sure to build the app.');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Express custom server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start full-stack server:', error);
  process.exit(1);
});
