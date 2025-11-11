import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Serve uploaded payment proof files (static)
  app.use(
    '/uploads',
    express.static(path.join(__dirname, '..', 'uploads')),
  );

  // ✅ Advanced & safer CORS setup
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',              // local frontend
        'https://jesco-demo.vercel.app',      // production site
      ];

      // Allow if no origin (like Postman) or matches allowed origins
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        console.warn(`🚫 Blocked CORS request from: ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  // ✅ Global Validation Pipe (for DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strip unknown fields
      transform: true,              // auto-transform primitives
      forbidNonWhitelisted: true,   // block extra fields
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ✅ Log environment details
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📁 Uploads accessible at http://localhost:${port}/uploads`);
}
bootstrap();
