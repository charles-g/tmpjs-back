import { NestFactory } from '@nestjs/core';
import { AppModule } from "../app.module";
import { AddToIndex } from "../search/domain/add-to-index.use-case";

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(
    AppModule,
  );

  const command = process.argv[2];

  switch (command) {
    case 'index-documents':
      const addToIndex = application.get(AddToIndex, { strict: false })
      await addToIndex.execute();
      break;
    default:
      console.log('Command not found');
      process.exit(1);
  }

  await application.close();
  process.exit(0);
}

bootstrap();
